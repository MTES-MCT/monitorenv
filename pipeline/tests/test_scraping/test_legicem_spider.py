from typing import List, Tuple

import pytest
from scrapy.http import HtmlResponse, Request

from config import TEST_DATA_LOCATION
from src.scraping.legicem.legicem.spiders.legicem_spider import (
    LegicemSpider,
    clean_document_title,
)

LEGICEM_URL = "https://legicem.metier.e2.rie.gouv.fr"


def fake_response(filename: str, url: str) -> HtmlResponse:
    """
    Builds a scrapy `HtmlResponse` for `url` with the content of the test file
    `filename`, without any network access.
    """
    with open(TEST_DATA_LOCATION / "legicem" / filename, "rb") as f:
        body = f.read()
    return HtmlResponse(
        url=url, body=body, encoding="utf-8", request=Request(url=url)
    )


def run_parse(
    spider: LegicemSpider, response: HtmlResponse
) -> Tuple[List[dict], List[Request]]:
    """Runs `spider.parse` and splits the results into items and requests."""
    results = list(spider.parse(response))
    items = [r for r in results if isinstance(r, dict)]
    requests = [r for r in results if isinstance(r, Request)]
    assert len(items) + len(requests) == len(results)
    return items, requests


@pytest.fixture
def spider() -> LegicemSpider:
    return LegicemSpider()


def test_spider_configuration(spider):
    assert spider.name == "legicem"
    assert spider.allowed_domains == ["legicem.metier.e2.rie.gouv.fr"]
    assert spider.start_urls == [
        f"{LEGICEM_URL}/reglementation-nationale-et-internationale-r1351.html",
        f"{LEGICEM_URL}/reglementation-par-facade-et-bassin-r17.html",
    ]


def test_parse_rubrique_follows_all_links_and_yields_no_item(spider):
    url = f"{LEGICEM_URL}/reglementation-par-facade-et-bassin-r17.html"
    response = fake_response("rubrique.html", url)

    items, requests = run_parse(spider, response)

    assert items == []
    assert [r.url for r in requests] == [
        # Articles of the list of articles
        f"{LEGICEM_URL}/arrete-prefectoral-mouillages-a101.html",
        f"{LEGICEM_URL}/arrete-zone-de-baignade-a102.html",
        # Sub-sections
        f"{LEGICEM_URL}/cultures-marines-r21.html",
        f"{LEGICEM_URL}/mouillages-r22.html",
        f"{LEGICEM_URL}/zones-de-baignade-r23.html",
        # Sections titles
        f"{LEGICEM_URL}/manche-est-mer-du-nord-r18.html",
        f"{LEGICEM_URL}/mediterranee-r19.html",
        # Pagination
        f"{LEGICEM_URL}/reglementation-par-facade-et-bassin-r17.html"
        "?debut_articles=10",
    ]
    assert all(r.callback == spider.parse for r in requests)


def test_parse_article_with_documents(spider):
    url = f"{LEGICEM_URL}/arrete-prefectoral-mouillages-a101.html"
    response = fake_response("article_with_documents.html", url)

    items, requests = run_parse(spider, response)

    assert items == [
        {
            "page_title": "Arrêté préfectoral mouillages",
            "page_url": url,
            "document_title": "Arrêté n°2026-101 (Format PDF)",
            "document_url": (
                f"{LEGICEM_URL}/fichier/pdf/arrete_mouillages_2026.pdf"
                "?arg=101&cle=abc&file=pdf%2Farrete_mouillages_2026.pdf"
            ),
        },
        {
            "page_title": "Arrêté préfectoral mouillages",
            "page_url": url,
            "document_title": "Annexe cartographique (Format KML)",
            "document_url": f"{LEGICEM_URL}/fichier/kml/annexe_carte.kml",
        },
        # The duplicate link is ignored, the link without `title` uses
        # `aria-label`, and the list of links in the text is ignored
        {
            "page_title": "Arrêté préfectoral mouillages",
            "page_url": url,
            "document_title": "Note de présentation",
            "document_url": f"{LEGICEM_URL}/fichier/odt/note.odt",
        },
    ]

    # Pagination inside the article
    assert [r.url for r in requests] == [f"{url}?page=2"]
    assert requests[0].callback == spider.parse


def test_parse_article_without_documents(spider):
    url = f"{LEGICEM_URL}/arrete-zone-de-baignade-a102.html"
    response = fake_response("article_without_documents.html", url)

    items, requests = run_parse(spider, response)

    assert items == [
        {
            "page_title": "Arrêté zone de baignade",
            "page_url": url,
            "document_title": None,
            "document_url": None,
        }
    ]
    assert requests == []


@pytest.mark.parametrize(
    "raw_title,expected",
    [
        (
            "Télécharger : AP 249 interdiction de mouillage (Format KML) - kml"
            " - 277.2 kio (nouvelle fenetre)",
            "AP 249 interdiction de mouillage (Format KML)",
        ),
        (
            "Télécharger : Arrêté n°12 - pdf - 1,2 Mio (nouvelle fenêtre)",
            "Arrêté n°12",
        ),
        # Titles containing " - " are kept whole
        (
            "Télécharger : Arrêté - zone Nord - pdf - 12 kio (nouvelle fenetre)",
            "Arrêté - zone Nord",
        ),
        # Texts that do not follow the pattern are kept as they are
        ("  Annexe   sans motif connu ", "Annexe sans motif connu"),
        ("", None),
        ("   ", None),
        (None, None),
    ],
)
def test_clean_document_title(raw_title, expected):
    assert clean_document_title(raw_title) == expected
