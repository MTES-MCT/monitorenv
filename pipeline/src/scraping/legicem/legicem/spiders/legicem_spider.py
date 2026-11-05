import datetime
import re
from typing import Optional, Tuple

import scrapy

LEGICEM_DOMAIN = "legicem.metier.e2.rie.gouv.fr"
LEGICEM_URL = f"https://{LEGICEM_DOMAIN}"

# Legicem pages are also published on the extranet, at the same paths
LEGICEM_URL_REGEX = re.compile(
    r"^https?://legicem\.metier\.e2\.rie\.gouv\.fr", flags=re.IGNORECASE
)
LEGICEM_EXTRANET_URL = (
    "https://extranet.legicem.metier.developpement-durable.gouv.fr"
)

# Download links of Legicem articles have a `title` attribute like :
# "Télécharger : AP 249 interdiction de mouillage (Format KML) - kml - 277.2 kio
# (nouvelle fenetre)". Only the document title is kept.
DOCUMENT_TITLE_REGEX = re.compile(
    r"^\s*T[ée]l[ée]charger\s*:\s*(?P<title>.+?)"  # « Télécharger : <titre> »
    r"\s+-\s+\w+"  # « - kml »
    r"\s+-\s+[\d.,]+\s*\w+"  # « - 277.2 kio »
    r"\s*\(nouvelle fen[eê]tre\)\s*$",  # « (nouvelle fenetre) »
    flags=re.IGNORECASE,
)

# Download links : <ul class="spip"><li><span><a href="..." title="...">
DOWNLOAD_LINKS_XPATH = (
    '//ul[contains(concat(" ", normalize-space(@class), " "), " spip ")]'
    "/li/span/a[@href]"
)

# Dates of an article :
# <div class="article__date">
#   <time datetime="2026-10-30">Publié le 30 octobre 2026</time>
#   <time datetime="2026-11-02">| Mis à jour le 2 novembre 2026</time>
# </div>
# The update date is optional and always comes after the publication date.
ARTICLE_DATES_XPATH = (
    '//div[contains(concat(" ", normalize-space(@class), " "), '
    '" article__date ")]/time/@datetime'
)

# Links followed to crawl the site, in this order
NAVIGATION_LINKS_XPATHS = [
    # Articles of a list of articles
    '//div[@class="articles-list__item__content _content"]/a/@href',
    # Sub-sections
    '//div[@class="rubrique__list__item"]/ul/li/a/@href',
    # Sections titles
    '//div[@class="rubrique__list__item"]/h2/a/@href',
    # Pagination of lists
    '//nav[@class="pagination"]/ul/li/a/@href',
    # Pagination inside articles
    '//nav[@class="pagination pagination-intra"]/ul/li/a/@href',
]


def clean_url(url: Optional[str]) -> Optional[str]:
    """Supprime « ?id_rub=...&lang=fr » (ou « &id_rub=... ») en fin d'URL."""
    if not url:
        return url
    return re.sub(r"[?&]id_rub=.*$", "", url)


def to_extranet_url(url: Optional[str]) -> Optional[str]:
    """
    Returns the extranet url of a Legicem page :
    "https://legicem.metier.e2.rie.gouv.fr/arrete-a101.html" becomes
    "https://extranet.legicem.metier.developpement-durable.gouv.fr/arrete-a101.html".

    The replacement is case-insensitive and works for http and https. Urls of
    other sites are returned as they are.
    """
    if not url:
        return url
    return LEGICEM_URL_REGEX.sub(LEGICEM_EXTRANET_URL, url, count=1)


def clean_document_title(raw_title: Optional[str]) -> Optional[str]:
    """
    Extracts the document title from the text of a Legicem download link.

    "Télécharger : AP 249 (Format KML) - kml - 277.2 kio (nouvelle fenetre)"
    becomes "AP 249 (Format KML)". Texts that do not follow this pattern are
    returned as they are (stripped), so that no title is lost.

    Args:
        raw_title (Optional[str]): text of the link (`title` attribute...)

    Returns:
        Optional[str]: the document title, `None` if the input is empty
    """
    if raw_title is None or not raw_title.strip():
        return None
    match = DOCUMENT_TITLE_REGEX.match(raw_title)
    if match:
        return match.group("title").strip()
    return " ".join(raw_title.split())


def parse_iso_date(value: Optional[str]) -> Optional[str]:
    """
    '2026-10-30' or '2026-10-30T09:15:00+01:00' -> '2026-10-30'.
    Returns `None` if the value is empty or is not a valid date.
    """
    if not value:
        return None
    try:
        return datetime.date.fromisoformat(value.strip()[:10]).isoformat()
    except ValueError:
        return None


def extract_article_dates(response) -> Tuple[Optional[str], Optional[str]]:
    """
    Returns the (publication date, update date) of a Legicem article, as ISO
    strings. The first <time> is the publication date, the second (optional)
    one is the update date.
    """
    dates = [
        parse_iso_date(value)
        for value in response.xpath(ARTICLE_DATES_XPATH).getall()
    ]
    published = dates[0] if len(dates) > 0 else None
    updated = dates[1] if len(dates) > 1 else None
    return published, updated


class LegicemSpider(scrapy.Spider):
    """
    Crawls Legicem recursively, starting from the "Réglementation nationale et
    internationale" and "Réglementation par façade et bassin" sections.

    Yields one item per downloadable document of each article page, or a single
    item with `None` document fields for article pages without any document.

    Items have the following fields:
      - page_title : title of the article page
      - page_url : url of the article page
      - page_url_extranet : url of the article page on the extranet
      - page_published_date : publication date of the article (ISO string)
      - page_updated_date : update date of the article (`None` if never
        updated)
      - document_title : title of the downloadable document (`None` if none)
      - document_url : absolute url of the document (`None` if none)

    The `?id_rub=...&lang=fr` suffix that Legicem adds to links is removed
    from all urls.
    """

    name = "legicem"
    allowed_domains = [LEGICEM_DOMAIN]
    start_urls = [
        f"{LEGICEM_URL}/reglementation-nationale-et-internationale-r1351.html",
        f"{LEGICEM_URL}/reglementation-par-facade-et-bassin-r17.html",
    ]

    def parse(self, response):
        # Documents of the page, if the page is an article
        title = response.xpath(
            '//main[@id="main"]/article/header/h1/text()'
        ).get()

        if title:
            page = {
                "page_title": title.strip(),
                "page_url": clean_url(response.url),
            }
            page["page_url_extranet"] = to_extranet_url(page["page_url"])
            (
                page["page_published_date"],
                page["page_updated_date"],
            ) = extract_article_dates(response)

            document_urls = set()

            for link in response.xpath(DOWNLOAD_LINKS_XPATH):
                document_url = clean_url(
                    response.urljoin(link.xpath("@href").get())
                )

                # The same document can be listed twice on a page
                if document_url in document_urls:
                    continue
                document_urls.add(document_url)

                # Title from the `title` attribute, or the `aria-label`
                # attribute, or the text of the link
                raw_title = (
                    link.xpath("@title").get()
                    or link.xpath("@aria-label").get()
                    or link.xpath("normalize-space(.)").get()
                )

                yield {
                    **page,
                    "document_title": clean_document_title(raw_title),
                    "document_url": document_url,
                }

            if not document_urls:
                yield {**page, "document_title": None, "document_url": None}

        # Links to other pages of Legicem. Urls are cleaned before being
        # requested, so that a page linked with different `id_rub` is only
        # crawled once.
        for xpath in NAVIGATION_LINKS_XPATHS:
            for href in response.xpath(xpath).getall():
                yield response.follow(
                    clean_url(response.urljoin(href)), callback=self.parse
                )
