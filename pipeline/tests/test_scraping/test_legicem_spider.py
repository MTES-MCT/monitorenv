from typing import List, Tuple

import pytest
from scrapy.http import HtmlResponse, Request

from config import TEST_DATA_LOCATION
from src.scraping.legicem.legicem.spiders.legicem_spider import (
    LegicemSpider,
    clean_document_title,
    clean_url,
    extract_article_dates,
    parse_iso_date,
    to_extranet_url,
)

LEGICEM_URL = "https://legicem.metier.e2.rie.gouv.fr"
EXTRANET_URL = "https://extranet.legicem.metier.developpement-durable.gouv.fr"


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
    # The `?id_rub=...&lang=fr` suffixes of the links are removed
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
            "page_url_extranet": (
                f"{EXTRANET_URL}/arrete-prefectoral-mouillages-a101.html"
            ),
            "page_published_date": "2025-03-12",
            "page_updated_date": "2026-10-30",
            "document_title": "Arrêté n°2026-101 (Format PDF)",
            "document_url": (
                f"{LEGICEM_URL}/fichier/pdf/arrete_mouillages_2026.pdf"
                "?arg=101&cle=abc&file=pdf%2Farrete_mouillages_2026.pdf"
            ),
        },
        {
            "page_title": "Arrêté préfectoral mouillages",
            "page_url": url,
            "page_url_extranet": (
                f"{EXTRANET_URL}/arrete-prefectoral-mouillages-a101.html"
            ),
            "page_published_date": "2025-03-12",
            "page_updated_date": "2026-10-30",
            "document_title": "Annexe cartographique (Format KML)",
            "document_url": f"{LEGICEM_URL}/fichier/kml/annexe_carte.kml",
        },
        # The duplicate link is ignored, the link without `title` uses
        # `aria-label`, the `?id_rub=...&lang=fr` suffix is removed, and the
        # list of links in the text is ignored
        {
            "page_title": "Arrêté préfectoral mouillages",
            "page_url": url,
            "page_url_extranet": (
                f"{EXTRANET_URL}/arrete-prefectoral-mouillages-a101.html"
            ),
            "page_published_date": "2025-03-12",
            "page_updated_date": "2026-10-30",
            "document_title": "Note de présentation",
            "document_url": f"{LEGICEM_URL}/fichier/odt/note.odt",
        },
    ]

    # Pagination inside the article, without the `&id_rub=...` suffix
    assert [r.url for r in requests] == [f"{url}?page=2"]
    assert requests[0].callback == spider.parse


def test_parse_article_without_documents(spider):
    url = f"{LEGICEM_URL}/arrete-zone-de-baignade-a102.html"
    response = fake_response(
        "article_without_documents.html", f"{url}?id_rub=23&lang=fr"
    )

    items, requests = run_parse(spider, response)

    assert items == [
        {
            "page_title": "Arrêté zone de baignade",
            # The `?id_rub=...&lang=fr` suffix is removed from the page url
            "page_url": url,
            "page_url_extranet": (
                f"{EXTRANET_URL}/arrete-zone-de-baignade-a102.html"
            ),
            # Article never updated : only a publication date
            "page_published_date": "2026-09-15",
            "page_updated_date": None,
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


@pytest.mark.parametrize(
    "url,expected",
    [
        (
            f"{LEGICEM_URL}/arrete-a101.html?id_rub=17&lang=fr",
            f"{LEGICEM_URL}/arrete-a101.html",
        ),
        # Other parameters before `id_rub` are kept
        (
            f"{LEGICEM_URL}/rubrique-r17.html?debut_articles=10&id_rub=17&lang=fr",
            f"{LEGICEM_URL}/rubrique-r17.html?debut_articles=10",
        ),
        # Urls without `id_rub` are not modified
        (
            f"{LEGICEM_URL}/fichier/kml/ap_249.kml?arg=7497&cle=651cd"
            "&file=kml%2Fap_249.kml",
            f"{LEGICEM_URL}/fichier/kml/ap_249.kml?arg=7497&cle=651cd"
            "&file=kml%2Fap_249.kml",
        ),
        (f"{LEGICEM_URL}/arrete-a101.html", f"{LEGICEM_URL}/arrete-a101.html"),
        ("", ""),
        (None, None),
    ],
)
def test_clean_url(url, expected):
    assert clean_url(url) == expected


@pytest.mark.parametrize(
    "value,expected",
    [
        ("2026-10-30", "2026-10-30"),
        ("2026-10-30T09:15:00+01:00", "2026-10-30"),
        (" 2026-10-30 ", "2026-10-30"),
        ("30 octobre 2026", None),
        ("2026-13-45", None),
        ("", None),
        (None, None),
    ],
)
def test_parse_iso_date(value, expected):
    assert parse_iso_date(value) == expected


@pytest.mark.parametrize(
    "dates_html,expected",
    [
        # Published and updated
        (
            '<div class="article__date">'
            '<time datetime="2026-10-30">Publié le 30 octobre 2026</time>'
            '<time datetime="2026-11-02">| Mis à jour le 2 novembre 2026</time>'
            "</div>",
            ("2026-10-30", "2026-11-02"),
        ),
        # Published only
        (
            '<div class="article__date">'
            '<time datetime="2026-10-30">Publié le 30 octobre 2026</time>'
            "</div>",
            ("2026-10-30", None),
        ),
        # No dates
        ("<p>Pas de date</p>", (None, None)),
    ],
)
def test_extract_article_dates(dates_html, expected):
    response = HtmlResponse(
        url=f"{LEGICEM_URL}/arrete-a101.html",
        body=f"<html><body>{dates_html}</body></html>".encode("utf-8"),
        encoding="utf-8",
    )
    assert extract_article_dates(response) == expected


@pytest.mark.parametrize(
    "url,expected",
    [
        (
            f"{LEGICEM_URL}/arrete-a101.html",
            f"{EXTRANET_URL}/arrete-a101.html",
        ),
        # Case-insensitive, http or https
        (
            "http://LEGICEM.metier.e2.rie.gouv.fr/arrete-a101.html",
            f"{EXTRANET_URL}/arrete-a101.html",
        ),
        (
            f"{LEGICEM_URL}/rubrique-r17.html?debut_articles=10",
            f"{EXTRANET_URL}/rubrique-r17.html?debut_articles=10",
        ),
        # Other sites are not modified
        (
            "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000000000001",
            "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000000000001",
        ),
        ("", ""),
        (None, None),
    ],
)
def test_to_extranet_url(url, expected):
    assert to_extranet_url(url) == expected
