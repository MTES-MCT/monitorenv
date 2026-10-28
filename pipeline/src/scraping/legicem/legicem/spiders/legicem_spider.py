import re
from typing import Optional

import scrapy

LEGICEM_DOMAIN = "legicem.metier.e2.rie.gouv.fr"
LEGICEM_URL = f"https://{LEGICEM_DOMAIN}"

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


class LegicemSpider(scrapy.Spider):
    """
    Crawls Legicem recursively, starting from the "Réglementation nationale et
    internationale" and "Réglementation par façade et bassin" sections.

    Yields one item per downloadable document of each article page, or a single
    item with `None` document fields for article pages without any document.

    Items have the following fields:
      - page_title : title of the article page
      - page_url : url of the article page
      - document_title : title of the downloadable document (`None` if none)
      - document_url : absolute url of the document (`None` if none)
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
            title = title.strip()
            document_urls = set()

            for link in response.xpath(DOWNLOAD_LINKS_XPATH):
                document_url = response.urljoin(link.xpath("@href").get())

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
                    "page_title": title,
                    "page_url": response.url,
                    "document_title": clean_document_title(raw_title),
                    "document_url": document_url,
                }

            if not document_urls:
                yield {
                    "page_title": title,
                    "page_url": response.url,
                    "document_title": None,
                    "document_url": None,
                }

        # Links to the articles of a list of articles
        for href in response.xpath(
            '//div[@class="articles-list__item__content _content"]/a/@href'
        ):
            yield response.follow(href, callback=self.parse)

        # Links to sub-sections
        for href in response.xpath(
            '//div[@class="rubrique__list__item"]/ul/li/a/@href'
        ):
            yield response.follow(href, callback=self.parse)

        # Links to sections titles
        for href in response.xpath(
            '//div[@class="rubrique__list__item"]/h2/a/@href'
        ):
            yield response.follow(href, callback=self.parse)

        # Pagination of lists
        for href in response.xpath(
            '//nav[@class="pagination"]/ul/li/a/@href'
        ):
            yield response.follow(href, callback=self.parse)

        # Pagination inside articles
        for href in response.xpath(
            '//nav[@class="pagination pagination-intra"]/ul/li/a/@href'
        ):
            yield response.follow(href, callback=self.parse)
