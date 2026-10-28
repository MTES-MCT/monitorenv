import datetime
import os
from email.message import EmailMessage
from pathlib import Path
from typing import Optional
from zoneinfo import ZoneInfo

import css_inline
import pandas as pd
from jinja2 import Environment, FileSystemLoader
from prefect import flow, get_run_logger, task
from prefect.logging.loggers import flow_run_logger
from scrapy.crawler import CrawlerProcess
from sqlalchemy import text

from config import (
    EMAIL_STYLESHEETS_LOCATION,
    EMAIL_TEMPLATES_LOCATION,
    LEGICEM_CHECKUP_EMAIL_ADDRESS,
    LIBRARY_LOCATION,
    MONITORENV_SENDER_EMAIL_ADDRESS,
)
from src.db_config import create_engine
from src.helpers.emails import create_html_email, send_email
from src.scraping.legicem.legicem.spiders.legicem_spider import LegicemSpider
from src.utils import psql_insert_copy

SCRAPED_FILE_LOCATION = LIBRARY_LOCATION / "data"
SCRAPED_FILENAME = "legicem.csv"
SCRAPED_FILEPATH = SCRAPED_FILE_LOCATION / SCRAPED_FILENAME

LEGICEM_COLUMNS = ["page_title", "page_url", "document_title", "document_url"]

FAILURE_EMAIL_SUBJECT = "[Monitorenv] Échec de l'extraction Legicem"

################################ Failure alert ################################


def create_scrape_failure_email(
    to: str,
    error_message: str,
    flow_run_name: str,
    failure_datetime_utc: datetime.datetime,
) -> EmailMessage:
    """
    Creates the email warning that the Legicem scraping failed.

    Args:
        to (str): recipient email address
        error_message (str): message of the failed or crashed state
        flow_run_name (str): name of the failed flow run, to find it in Prefect
        failure_datetime_utc (datetime.datetime): naive UTC datetime of failure

    Returns:
        EmailMessage
    """
    env = Environment(
        loader=FileSystemLoader(
            [EMAIL_TEMPLATES_LOCATION, EMAIL_STYLESHEETS_LOCATION]
        ),
        # Templates are .jinja files, which select_autoescape() does not
        # escape : autoescape is explicitly enabled.
        autoescape=True,
    )
    template = env.get_template("legicem_scrape_failure.jinja")
    failure_datetime = (
        failure_datetime_utc.replace(tzinfo=datetime.timezone.utc)
        .astimezone(ZoneInfo("Europe/Paris"))
        .strftime("%d/%m/%Y %H:%M")
    )
    html_content = css_inline.inline(
        template.render(
            failure_datetime=failure_datetime,
            flow_run_name=flow_run_name,
            error_message=error_message,
        )
    )
    return create_html_email(
        to=to,
        subject=FAILURE_EMAIL_SUBJECT,
        html=html_content,
        from_=MONITORENV_SENDER_EMAIL_ADDRESS,
    )


def notify_scrape_legicem_failure(flow, flow_run, state):
    """
    Prefect `on_failure` / `on_crashed` hook of the `Monitorenv - Scrape legicem`
    flow : emails `LEGICEM_CHECKUP_EMAIL_ADDRESS` (or the `email_address`
    parameter of the flow run, if given) to warn that the scraping failed.

    Like the flow itself, does not actually send the email when the flow run's
    `is_integration` parameter is `True`.

    The hook never raises : a failure to send the alert is only logged, so that
    it cannot hide the original error of the flow run.
    """
    logger = flow_run_logger(flow_run, flow)
    try:
        parameters = flow_run.parameters or {}
        is_integration = parameters.get("is_integration", True)
        recipient = (
            parameters.get("email_address") or LEGICEM_CHECKUP_EMAIL_ADDRESS
        )

        if not recipient:
            logger.error(
                "LEGICEM_CHECKUP_EMAIL_ADDRESS is not set in the pipeline .env "
                "file, Legicem scraping failure alert not sent."
            )
            return

        message = create_scrape_failure_email(
            to=recipient,
            error_message=state.message or "Erreur inconnue",
            flow_run_name=flow_run.name,
            failure_datetime_utc=datetime.datetime.now(
                datetime.timezone.utc
            ).replace(tzinfo=None),
        )

        if is_integration:
            logger.info(
                f"(Mock) Sending Legicem scraping failure alert to {recipient}."
            )
            return

        logger.info(f"Sending Legicem scraping failure alert to {recipient}.")
        send_errors = send_email(message)
        if send_errors:
            logger.error(
                f"Legicem scraping failure alert refused: {send_errors}"
            )
    except Exception:
        logger.exception("Could not send the Legicem scraping failure alert.")

#################################### Tasks ####################################


@task
def delete_csv(filepath: Path):
    """Deletes the csv file at `filepath` if it exists."""
    logger = get_run_logger()
    if filepath.exists():
        logger.info(f"{filepath.name} found, deleting.")
        os.remove(filepath)
    else:
        logger.info(f"{filepath.name} not found, skipping.")


@task
def scrape_legicem_to_csv(filepath: Path) -> datetime.datetime:
    """
    Scrapes all links to regulations in Legicem and stores the results in a csv
    file at `filepath`.

    Args:
        filepath (Path): path of the csv file to write

    Returns:
        datetime.datetime: naive UTC datetime of the beginning of the extraction
    """
    # Legicem is on the RIE network and must be reached without the Internet
    # proxy.
    for proxy_env in ["http_proxy", "https_proxy", "HTTP_PROXY", "HTTPS_PROXY"]:
        os.environ.pop(proxy_env, None)

    filepath.parent.mkdir(parents=True, exist_ok=True)

    extraction_datetime_utc = datetime.datetime.now(
        datetime.timezone.utc
    ).replace(tzinfo=None)

    process = CrawlerProcess(
        settings={
            "LOG_LEVEL": "INFO",
            "ROBOTSTXT_OBEY": True,
            "FEEDS": {
                str(filepath): {
                    "format": "csv",
                    "encoding": "utf-8",
                    "fields": LEGICEM_COLUMNS,
                }
            },
        }
    )
    process.crawl(LegicemSpider)
    process.start()
    return extraction_datetime_utc


@task
def read_legicem_csv(
    filepath: Path, extraction_datetime_utc: datetime.datetime
) -> pd.DataFrame:
    """
    Reads the csv file of Legicem urls (output of the `scrape_legicem_to_csv`
    task) and adds the input `datetime.datetime` as value in the column
    `extraction_datetime_utc` and 'latest' as value in the column
    `extraction_occurence`.

    Raises a `ValueError` if the file is missing or contains no rows, so that a
    failed scraping (site unreachable, change in the site's HTML structure...)
    does not replace the data of the previous extraction.

    Args:
        filepath (Path): path of the csv file to read
        extraction_datetime_utc (datetime.datetime): datetime of the extraction

    Returns:
        pd.DataFrame: `DataFrame` of regulations in Legicem
    """
    if not filepath.exists() or filepath.stat().st_size == 0:
        raise ValueError(
            f"{filepath.name} is missing or empty, Legicem scraping failed."
        )

    legicem = pd.read_csv(filepath, dtype=str)

    if len(legicem) == 0:
        raise ValueError(
            f"{filepath.name} contains no rows, Legicem scraping failed."
        )

    legicem = legicem[LEGICEM_COLUMNS]
    legicem["extraction_datetime_utc"] = extraction_datetime_utc
    legicem["extraction_occurence"] = "latest"
    return legicem


@task
def load_legicem(legicem: pd.DataFrame):
    """
    Deletes `previous` extraction occurence in legicem table, then
    changes `latest` extraction occurence to `previous` in legicem table, then
    loads input DataFrame as `latest` occurence in `legicem` table.

    Args:
        legicem (pd.DataFrame): DataFrame with all links to regulations in
          Legicem.
    """
    e = create_engine("monitorenv_remote")
    logger = get_run_logger()

    with e.begin() as connection:
        logger.info("Deleting 'previous' extraction.")
        connection.execute(
            text("DELETE FROM legicem WHERE extraction_occurence = 'previous'")
        )

        logger.info("Tagging 'latest' extraction as 'previous'.")
        connection.execute(
            text("UPDATE legicem SET extraction_occurence = 'previous'")
        )

        logger.info(f"Loading {len(legicem)} freshly extracted rows as 'latest'")
        legicem.to_sql(
            name="legicem",
            con=connection,
            schema="public",
            if_exists="append",
            index=False,
            method=psql_insert_copy,
        )


@flow(
    name="Monitorenv - Scrape legicem",
    on_failure=[notify_scrape_legicem_failure],
    on_crashed=[notify_scrape_legicem_failure],
)
def scrape_legicem_flow(
    is_integration: bool = True, email_address: Optional[str] = None
):
    """
    Scrapes Legicem and loads the result in the `legicem` table, keeping the
    previous extraction.

    If the flow fails or crashes, an alert is emailed to
    `LEGICEM_CHECKUP_EMAIL_ADDRESS` (see `notify_scrape_legicem_failure`).

    Args:
        is_integration (bool): if `True`, the failure alert is not actually
          sent. Defaults to `True` so that a manual run never sends an email by
          mistake.
        email_address (Optional[str]): if given, the failure alert is sent to
          this address instead of `LEGICEM_CHECKUP_EMAIL_ADDRESS`, for instance
          to test the alert with a manual run.
    """
    delete_csv(SCRAPED_FILEPATH)
    extraction_datetime_utc = scrape_legicem_to_csv(SCRAPED_FILEPATH)
    legicem = read_legicem_csv(SCRAPED_FILEPATH, extraction_datetime_utc)
    load_legicem(legicem)
