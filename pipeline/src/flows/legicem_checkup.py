import datetime
import html
import re
from email.message import EmailMessage
from typing import Iterable, List, Optional, Tuple
from zoneinfo import ZoneInfo

import css_inline
import pandas as pd
from jinja2 import Environment, FileSystemLoader, Template
from prefect import flow, get_run_logger, task

from config import (
    EMAIL_STYLESHEETS_LOCATION,
    EMAIL_TEMPLATES_LOCATION,
    LEGICEM_CHECKUP_EMAIL_ADDRESS,
    MONITORENV_SENDER_EMAIL_ADDRESS,
)
from src.generic_tasks import extract
from src.helpers.emails import create_html_email, send_email
from src.shared_tasks.dates import get_utcnow

# Legicem (SPIP) article urls look like
# https://legicem.metier.e2.rie.gouv.fr/some-article-title-a1234.html
LEGICEM_URL_REGEX = re.compile(
    r"^https?://legicem\.metier\.e2\.rie\.gouv\.fr/",
    flags=re.IGNORECASE,
)
LEGICEM_ARTICLE_ID_REGEX = (
    r"^https?://legicem\.metier\.e2\.rie\.gouv\.fr/"
    r"(?:[a-zA-Z0-9-]*)"
    r"-a(?P<article_id>\d+)"
    r"\.html"
)

EMAIL_SUBJECT = "[Monitorenv] Suivi des modifications Legicem"

REFERENCE_COLUMNS_LABELS = {
    "reference_type": "Type",
    "group_name": "Groupe",
    "name": "Nom",
}

####################################### Helpers #######################################


def make_html_hyperlinks(urls: Iterable, link_texts: Iterable) -> List[str]:
    """
    Returns a list of html links like `<a href="url">link_text</a>`.

    Texts and urls are html-escaped, since they come from scraped web pages or
    from user inputs. When a link text is missing, the url is used as text.

    Args:
        urls (Iterable): urls
        link_texts (Iterable): texts of the links

    Returns:
        List[str]: html links
    """
    hyperlinks = []
    for url, link_text in zip(urls, link_texts):
        url = None if pd.isna(url) else str(url)
        link_text = None if pd.isna(link_text) else str(link_text)
        text = html.escape(link_text or url or "")
        href = html.escape(url or "#", quote=True)
        hyperlinks.append(f'<a href="{href}">{text}</a>')
    return hyperlinks


def is_legicem_url(url: Optional[str]) -> bool:
    return isinstance(url, str) and bool(LEGICEM_URL_REGEX.match(url))


def add_article_id(df: pd.DataFrame, url_column: str) -> pd.DataFrame:
    """
    Returns a copy of `df` with an added `article_id` column, extracted from the
    urls of `url_column` according to the Legicem url schema. Urls that do not
    match the schema get a `None` article_id.
    """
    res = df.copy(deep=True)
    article_ids = (
        res[url_column]
        .astype("string")
        .str.extract(LEGICEM_ARTICLE_ID_REGEX, flags=re.IGNORECASE, expand=False)
    )
    res["article_id"] = article_ids.astype(object).where(
        article_ids.notna(), None
    )
    return res


def naive_utc_to_paris_string(dt: Optional[datetime.datetime]) -> Optional[str]:
    if dt is None or pd.isna(dt):
        return None
    dt = pd.Timestamp(dt).to_pydatetime()
    return (
        dt.replace(tzinfo=datetime.timezone.utc)
        .astimezone(ZoneInfo("Europe/Paris"))
        .strftime("%d/%m/%Y %H:%M")
    )


def to_html_table(df: pd.DataFrame) -> str:
    return df.to_html(index=False, justify="center", escape=False, na_rep="")


################################### Tasks and flows ###################################


@task
def extract_legicem() -> pd.DataFrame:
    """
    Extracts the two latest Legicem scrapings (`previous` and `latest`) from the
    `legicem` table, filled by the `Monitorenv - Scrape legicem` flow, and adds an
    `article_id` column.
    """
    legicem = extract(
        "monitorenv_remote", query_filepath="monitorenv/legicem.sql"
    )
    return add_article_id(legicem, url_column="page_url")


@task
def extract_legicem_references() -> pd.DataFrame:
    """
    Extracts the regulatory areas and AMPs of Monitorenv whose url points to
    Legicem, and adds an `article_id` column.
    """
    references = extract(
        "monitorenv_remote", query_filepath="monitorenv/legicem_references.sql"
    )
    references = references[references.url.map(is_legicem_url)]
    return add_article_id(references, url_column="url").reset_index(drop=True)


@task
def get_extraction_datetimes(
    legicem: pd.DataFrame,
) -> Tuple[Optional[str], Optional[str]]:
    """
    Returns the datetimes (Europe/Paris, as strings) of the `previous` and
    `latest` Legicem extractions. Returns `None` for missing extractions.
    """

    def get_datetime(occurence: str) -> Optional[str]:
        datetimes = legicem.loc[
            legicem.extraction_occurence == occurence, "extraction_datetime_utc"
        ]
        if len(datetimes) == 0:
            return None
        return naive_utc_to_paris_string(datetimes.iloc[0])

    return get_datetime("previous"), get_datetime("latest")


@task
def get_modified_documents(
    legicem: pd.DataFrame, references: pd.DataFrame
) -> pd.DataFrame:
    """
    Returns the documents of Legicem that :

      - were either added to or removed from a Legicem page between the
        `previous` and `latest` extractions
      - belong to a Legicem page present in both extractions (new or deleted pages
        are not considered as modifications of existing pages)
      - belong to a Legicem page referenced by at least one regulatory area or
        AMP of Monitorenv

    The output has one row per (modified document, referencing area), with
    formatted columns ready to be displayed in the email.
    """
    latest = legicem[legicem.extraction_occurence == "latest"]
    previous = legicem[legicem.extraction_occurence == "previous"]

    stable_article_ids = set(latest.article_id.dropna()) & set(
        previous.article_id.dropna()
    )
    modified_document_urls = set(latest.document_url.dropna()) ^ set(
        previous.document_url.dropna()
    )

    modified_documents = legicem[
        legicem.document_url.isin(modified_document_urls)
        & legicem.article_id.isin(stable_article_ids)
    ]

    res = pd.merge(
        references, modified_documents, on="article_id", suffixes=("", "_legicem")
    )

    res["Modification"] = res.extraction_occurence.map(
        {"latest": "Ajout de document", "previous": "Suppression de document"}
    )
    res["Référence réglementaire"] = make_html_hyperlinks(
        res.url, res.reference
    )
    res["Document"] = make_html_hyperlinks(res.document_url, res.document_title)

    columns = list(REFERENCE_COLUMNS_LABELS) + [
        "Référence réglementaire",
        "Modification",
        "Document",
    ]
    return (
        res[columns]
        .sort_values(columns)
        .rename(columns=REFERENCE_COLUMNS_LABELS)
        .reset_index(drop=True)
    )


@task
def get_unknown_links(
    legicem: pd.DataFrame, references: pd.DataFrame
) -> pd.DataFrame:
    """
    Returns the regulatory areas and AMPs of Monitorenv whose Legicem url does
    not correspond to any article found in the `latest` Legicem extraction : dead
    link, moved article, or page outside of the scraped sections of Legicem.

    Returns an empty DataFrame when there is no `latest` extraction, to avoid
    reporting every link as unknown.
    """
    latest_article_ids = set(
        legicem.loc[
            legicem.extraction_occurence == "latest", "article_id"
        ].dropna()
    )

    if len(latest_article_ids) == 0:
        unknown = references.iloc[0:0]
    else:
        unknown = references[~references.article_id.isin(latest_article_ids)]

    res = unknown.copy(deep=True)
    res["Lien Legicem"] = make_html_hyperlinks(res.url, res.reference)

    columns = list(REFERENCE_COLUMNS_LABELS) + ["Lien Legicem"]
    return (
        res[columns]
        .sort_values(columns)
        .rename(columns=REFERENCE_COLUMNS_LABELS)
        .reset_index(drop=True)
    )


@task
def get_newly_missing_links(
    legicem: pd.DataFrame, references: pd.DataFrame
) -> pd.DataFrame:
    """
    Returns the regulatory areas and AMPs of Monitorenv whose Legicem article
    was present in the `previous` extraction but is no longer present in the
    `latest` extraction (article deleted or moved since the previous
    extraction).

    Returns an empty DataFrame when one of the two extractions is missing.
    """
    latest_article_ids = set(
        legicem.loc[
            legicem.extraction_occurence == "latest", "article_id"
        ].dropna()
    )
    previous_article_ids = set(
        legicem.loc[
            legicem.extraction_occurence == "previous", "article_id"
        ].dropna()
    )

    if len(latest_article_ids) == 0 or len(previous_article_ids) == 0:
        return references.iloc[0:0].reset_index(drop=True)

    return references[
        references.article_id.isin(previous_article_ids)
        & ~references.article_id.isin(latest_article_ids)
    ].reset_index(drop=True)


@task
def has_changes(
    modified_documents: pd.DataFrame, newly_missing_links: pd.DataFrame
) -> bool:
    """
    Returns `True` if Legicem changed since the previous extraction in a way
    that concerns Monitorenv : documents added to or removed from a referenced
    page, or a referenced page that disappeared.

    Links that were already unknown in the previous extraction are not
    considered as changes, so that a dead link does not trigger an email every
    day.
    """
    return len(modified_documents) > 0 or len(newly_missing_links) > 0


@task
def get_template() -> Template:
    env = Environment(
        loader=FileSystemLoader(
            [EMAIL_TEMPLATES_LOCATION, EMAIL_STYLESHEETS_LOCATION]
        ),
        # Templates are .jinja files, which select_autoescape() does not
        # escape : autoescape is explicitly enabled.
        autoescape=True,
    )
    return env.get_template("legicem_checkup.jinja")


@task
def render(
    template: Template,
    previous_extraction_datetime: Optional[str],
    latest_extraction_datetime: Optional[str],
    n_references: int,
    modified_documents: pd.DataFrame,
    unknown_links: pd.DataFrame,
    utcnow: datetime.datetime,
) -> str:
    """Renders the email as an html string with inlined css."""
    html_content = template.render(
        verification_date=utcnow.strftime("%d/%m/%Y"),
        previous_extraction_datetime=previous_extraction_datetime,
        latest_extraction_datetime=latest_extraction_datetime,
        n_references=n_references,
        n_modified_documents=len(modified_documents),
        modified_documents=(
            to_html_table(modified_documents)
            if len(modified_documents) > 0
            else None
        ),
        n_unknown_links=len(unknown_links),
        unknown_links=(
            to_html_table(unknown_links) if len(unknown_links) > 0 else None
        ),
    )
    return css_inline.inline(html_content)


@task
def create_email(
    html_content: str, email_address: Optional[str] = None
) -> EmailMessage:
    """
    Creates the email, addressed to `email_address` if given, else to
    `LEGICEM_CHECKUP_EMAIL_ADDRESS`.
    """
    recipient = email_address or LEGICEM_CHECKUP_EMAIL_ADDRESS
    if not recipient:
        raise ValueError(
            "LEGICEM_CHECKUP_EMAIL_ADDRESS is not set in the pipeline "
            ".env file."
        )
    return create_html_email(
        to=recipient,
        subject=EMAIL_SUBJECT,
        html=html_content,
        from_=MONITORENV_SENDER_EMAIL_ADDRESS,
    )


@task
def send_legicem_checkup_email(message: EmailMessage, is_integration: bool):
    logger = get_run_logger()
    if is_integration:
        logger.info(f"(Mock) Sending Legicem checkup email to {message['To']}.")
        return

    logger.info(f"Sending Legicem checkup email to {message['To']}.")
    send_errors = send_email(message)
    if send_errors:
        raise RuntimeError(
            f"Legicem checkup email refused for some recipients: {send_errors}"
        )


@flow(name="Monitorenv - Legicem checkup")
def legicem_checkup_flow(
    is_integration: bool = True,
    email_address: Optional[str] = None,
    send_if_no_change: bool = False,
) -> Optional[EmailMessage]:
    """
    Compares the two latest Legicem scrapings and, if Legicem changed in a way
    that concerns Monitorenv, emails a summary to
    `LEGICEM_CHECKUP_EMAIL_ADDRESS` (set in the pipeline .env file) :

      - documents added to or removed from Legicem pages referenced by
        regulatory areas or AMPs of Monitorenv
      - Legicem links of Monitorenv that were not found in the latest scraping

    No email is sent when there is no change (see `has_changes`).

    Args:
        is_integration (bool): if `True`, the email is not actually sent.
          Defaults to `True` so that a manual run never sends an email by mistake.
        email_address (Optional[str]): if given, the email is sent to this
          address instead of `LEGICEM_CHECKUP_EMAIL_ADDRESS`, for instance to
          test the email with a manual run.
        send_if_no_change (bool): if `True`, the email is sent even if there
          was no change, for instance to test the email with a manual run.
          Defaults to `False`.

    Returns:
        Optional[EmailMessage]: the email, or `None` if there was no change.
    """
    logger = get_run_logger()

    legicem = extract_legicem()
    references = extract_legicem_references()
    utcnow = get_utcnow()
    template = get_template()

    previous_extraction_datetime, latest_extraction_datetime = (
        get_extraction_datetimes(legicem)
    )
    modified_documents = get_modified_documents(legicem, references)
    newly_missing_links = get_newly_missing_links(legicem, references)

    if not send_if_no_change and not has_changes(
        modified_documents, newly_missing_links
    ):
        logger.info("No change in Legicem since the previous extraction.")
        logger.info("No email sent.")
        return None

    unknown_links = get_unknown_links(legicem, references)

    html_content = render(
        template=template,
        previous_extraction_datetime=previous_extraction_datetime,
        latest_extraction_datetime=latest_extraction_datetime,
        n_references=len(references),
        modified_documents=modified_documents,
        unknown_links=unknown_links,
        utcnow=utcnow,
    )
    message = create_email(html_content, email_address=email_address)
    send_legicem_checkup_email(message, is_integration=is_integration)
    return message
