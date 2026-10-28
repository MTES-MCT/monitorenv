import datetime
from unittest.mock import patch

import pandas as pd
import pytest
from sqlalchemy import text

from src.db_config import create_engine
from src.flows.legicem_checkup import (
    EMAIL_SUBJECT,
    add_article_id,
    get_extraction_datetimes,
    get_modified_documents,
    get_newly_missing_links,
    get_unknown_links,
    has_changes,
    is_legicem_url,
    legicem_checkup_flow,
    make_html_hyperlinks,
)

LEGICEM_URL = "https://legicem.metier.e2.rie.gouv.fr"
URL_A101 = f"{LEGICEM_URL}/arrete-prefectoral-mouillages-a101.html"
URL_A102 = f"{LEGICEM_URL}/arrete-zone-de-baignade-a102.html"
URL_A999 = f"{LEGICEM_URL}/arrete-supprime-a999.html"
DOC_2025 = f"{LEGICEM_URL}/IMG/pdf/arrete_mouillages_2025.pdf"
DOC_2026 = f"{LEGICEM_URL}/IMG/pdf/arrete_mouillages_2026.pdf"
EXTERNAL_URL = "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000000000001"


################################## Test data ##################################


@pytest.fixture
def legicem() -> pd.DataFrame:
    """Same content as `V666.36__Reset_test_legicem.sql`, with article ids."""
    return pd.DataFrame(
        {
            "extraction_datetime_utc": [
                datetime.datetime(2026, 10, 22, 3, 15),
                datetime.datetime(2026, 10, 22, 3, 15),
                datetime.datetime(2026, 10, 21, 3, 15),
                datetime.datetime(2026, 10, 21, 3, 15),
            ],
            "extraction_occurence": ["latest", "latest", "previous", "previous"],
            "page_title": [
                "Arrêté préfectoral mouillages",
                "Arrêté zone de baignade",
                "Ancien arrêté supprimé",
                "Arrêté préfectoral mouillages",
            ],
            "page_url": [
                URL_A101,
                URL_A102,
                f"{LEGICEM_URL}/ancien-arrete-a050.html",
                URL_A101,
            ],
            "document_title": [
                "Arrêté n°2026-101 - PDF",
                None,
                None,
                "Arrêté n°2025-087 - PDF",
            ],
            "document_url": [DOC_2026, None, None, DOC_2025],
            "article_id": ["101", "102", "050", "101"],
        }
    )


@pytest.fixture
def references() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "reference_type": ["Zone réglementaire", "AMP", "Zone réglementaire"],
            "id": [9001, 9001, 9002],
            "group_name": ["Mouillages Corse", "Parc naturel marin", "Baignade"],
            "name": ["Zone de mouillage 1", "PNM Cap Corse", "Zone 999"],
            "reference": ["Arrêté mouillages", "Décret PNM", "Arrêté supprimé"],
            "url": [URL_A101, URL_A102, URL_A999],
            "article_id": ["101", "102", "999"],
        }
    )


@pytest.fixture
def insert_legicem_references(reset_test_data):
    """
    Inserts regulatory areas and AMPs referencing Legicem (and one external url,
    which must be ignored) in the test database. The data is reset by the
    `reset_test_data` fixture of the next test.
    """
    e = create_engine("monitorenv_remote")
    with e.begin() as connection:
        connection.execute(
            text(
                """
                INSERT INTO regulatory_areas
                    (id, area_type, layer_name, poly_name, ref_reg, url)
                VALUES
                    (9001, 'ZONE', 'Mouillages Corse', 'Zone de mouillage 1',
                     'Arrêté mouillages', :url_a101),
                    (9002, 'ZONE', 'Baignade', 'Zone 999',
                     'Arrêté supprimé', :url_a999),
                    (9003, 'ZONE', 'Pêche à pied', 'Zone externe',
                     'Arrêté Legifrance', :external_url);

                INSERT INTO amp_cacem
                    (id, geom, mpa_oriname, des_desigfr, ref_reg, url_legicem)
                VALUES
                    (9001, 'MULTIPOLYGON(((0 0,1 0,1 1,0 1,0 0)))',
                     'PNM Cap Corse', 'Parc naturel marin', 'Décret PNM',
                     :url_a102);
                """
            ),
            {
                "url_a101": URL_A101,
                "url_a102": URL_A102,
                "url_a999": URL_A999,
                "external_url": EXTERNAL_URL,
            },
        )


################################## Helpers ####################################


def test_is_legicem_url():
    assert is_legicem_url(URL_A101)
    assert is_legicem_url("http://LEGICEM.metier.e2.rie.gouv.fr/x-r17.html")
    assert not is_legicem_url(EXTERNAL_URL)
    assert not is_legicem_url("url1")
    assert not is_legicem_url(None)


def test_add_article_id():
    df = pd.DataFrame(
        {
            "url": [
                URL_A101,
                f"{URL_A102}?page=2",
                f"{LEGICEM_URL}/reglementation-par-facade-et-bassin-r17.html",
                EXTERNAL_URL,
                None,
            ]
        }
    )
    res = add_article_id(df, url_column="url")
    assert res.article_id.tolist() == ["101", "102", None, None, None]
    assert "article_id" not in df.columns


def test_make_html_hyperlinks_escapes_texts_and_urls():
    links = make_html_hyperlinks(
        [URL_A101, None, 'https://x.fr/"><script>'],
        ["Arrêté <b>n°1</b>", "Sans lien", None],
    )
    assert links == [
        f'<a href="{URL_A101}">Arrêté &lt;b&gt;n°1&lt;/b&gt;</a>',
        '<a href="#">Sans lien</a>',
        (
            '<a href="https://x.fr/&quot;&gt;&lt;script&gt;">'
            "https://x.fr/&quot;&gt;&lt;script&gt;</a>"
        ),
    ]


################################### Tasks #####################################


def test_get_extraction_datetimes(legicem):
    assert get_extraction_datetimes.fn(legicem) == (
        "21/10/2026 05:15",
        "22/10/2026 05:15",
    )


def test_get_extraction_datetimes_without_previous_extraction(legicem):
    latest_only = legicem[legicem.extraction_occurence == "latest"]
    assert get_extraction_datetimes.fn(latest_only) == (
        None,
        "22/10/2026 05:15",
    )
    assert get_extraction_datetimes.fn(legicem.iloc[0:0]) == (None, None)


def test_get_modified_documents(legicem, references):
    res = get_modified_documents.fn(legicem, references)

    expected = pd.DataFrame(
        {
            "Type": ["Zone réglementaire", "Zone réglementaire"],
            "Groupe": ["Mouillages Corse", "Mouillages Corse"],
            "Nom": ["Zone de mouillage 1", "Zone de mouillage 1"],
            "Référence réglementaire": [
                f'<a href="{URL_A101}">Arrêté mouillages</a>',
                f'<a href="{URL_A101}">Arrêté mouillages</a>',
            ],
            "Modification": ["Ajout de document", "Suppression de document"],
            "Document": [
                f'<a href="{DOC_2026}">Arrêté n°2026-101 - PDF</a>',
                f'<a href="{DOC_2025}">Arrêté n°2025-087 - PDF</a>',
            ],
        }
    )
    pd.testing.assert_frame_equal(res, expected)


def test_get_modified_documents_ignores_unreferenced_pages(legicem, references):
    res = get_modified_documents.fn(
        legicem, references[references.article_id != "101"]
    )
    assert len(res) == 0
    assert list(res.columns) == [
        "Type",
        "Groupe",
        "Nom",
        "Référence réglementaire",
        "Modification",
        "Document",
    ]


def test_get_modified_documents_without_previous_extraction(
    legicem, references
):
    latest_only = legicem[legicem.extraction_occurence == "latest"]
    assert len(get_modified_documents.fn(latest_only, references)) == 0


def test_get_unknown_links(legicem, references):
    res = get_unknown_links.fn(legicem, references)

    expected = pd.DataFrame(
        {
            "Type": ["Zone réglementaire"],
            "Groupe": ["Baignade"],
            "Nom": ["Zone 999"],
            "Lien Legicem": [f'<a href="{URL_A999}">Arrêté supprimé</a>'],
        }
    )
    pd.testing.assert_frame_equal(res, expected)


def test_get_unknown_links_without_extraction(legicem, references):
    res = get_unknown_links.fn(legicem.iloc[0:0], references)
    assert len(res) == 0
    assert list(res.columns) == ["Type", "Groupe", "Nom", "Lien Legicem"]


def test_get_newly_missing_links(legicem, references):
    # Article 050 was in the previous extraction but not in the latest one
    reference_to_deleted_article = pd.DataFrame(
        {
            "reference_type": ["Zone réglementaire"],
            "id": [9004],
            "group_name": ["Ancien groupe"],
            "name": ["Ancienne zone"],
            "reference": ["Ancien arrêté"],
            "url": [f"{LEGICEM_URL}/ancien-arrete-a050.html"],
            "article_id": ["050"],
        }
    )
    all_references = pd.concat(
        [references, reference_to_deleted_article], ignore_index=True
    )

    res = get_newly_missing_links.fn(legicem, all_references)

    # Article 999 is unknown in both extractions : it is not a new change
    assert res.id.tolist() == [9004]


def test_get_newly_missing_links_without_previous_extraction(
    legicem, references
):
    latest_only = legicem[legicem.extraction_occurence == "latest"]
    assert len(get_newly_missing_links.fn(latest_only, references)) == 0


def test_has_changes(legicem, references):
    modified_documents = get_modified_documents.fn(legicem, references)
    no_modified_documents = modified_documents.iloc[0:0]
    newly_missing_links = references.iloc[0:1]
    no_newly_missing_links = references.iloc[0:0]

    assert has_changes.fn(modified_documents, no_newly_missing_links)
    assert has_changes.fn(no_modified_documents, newly_missing_links)
    assert not has_changes.fn(no_modified_documents, no_newly_missing_links)


#################################### Flow #####################################


@pytest.fixture
def no_change_in_legicem(insert_legicem_references):
    """
    Replaces the `previous` Legicem extraction by a copy of the `latest` one,
    so that there is no change between the two extractions.
    """
    e = create_engine("monitorenv_remote")
    with e.begin() as connection:
        connection.execute(
            text(
                """
                DELETE FROM legicem WHERE extraction_occurence = 'previous';

                INSERT INTO legicem
                SELECT
                    extraction_datetime_utc - INTERVAL '1 day',
                    'previous',
                    page_title,
                    page_url,
                    document_title,
                    document_url
                FROM legicem
                WHERE extraction_occurence = 'latest';
                """
            )
        )


def test_flow(insert_legicem_references):
    with patch("src.flows.legicem_checkup.send_email") as mock_send_email:
        state = legicem_checkup_flow(is_integration=True, return_state=True)

    assert state.is_completed()
    mock_send_email.assert_not_called()

    message = state.result()
    assert message["Subject"] == EMAIL_SUBJECT
    assert message["To"] == "legicem.checkup@email.fr"
    assert message["From"] == "monitorenv@email.fr"

    html_content = message.get_content()
    assert "21/10/2026 05:15" in html_content
    assert "22/10/2026 05:15" in html_content
    assert "3 zones réglementaires et AMP" in html_content

    # Modified documents of the page referenced by regulatory area 9001
    assert "2 modification(s)" in html_content
    assert "Ajout de document" in html_content
    assert "Suppression de document" in html_content
    assert DOC_2025 in html_content
    assert DOC_2026 in html_content

    # Legicem link of regulatory area 9002 not found in the latest scraping
    assert "1 lien(s) Legicem" in html_content
    assert URL_A999 in html_content

    # Non-Legicem urls are ignored
    assert EXTERNAL_URL not in html_content
    assert "url1" not in html_content


def test_flow_sends_email_when_not_in_integration(insert_legicem_references):
    with patch(
        "src.flows.legicem_checkup.send_email", return_value={}
    ) as mock_send_email:
        state = legicem_checkup_flow(is_integration=False, return_state=True)

    assert state.is_completed()
    mock_send_email.assert_called_once()
    sent_message = mock_send_email.call_args.args[0]
    assert sent_message["Subject"] == EMAIL_SUBJECT


def test_flow_fails_when_email_is_refused(insert_legicem_references):
    with patch(
        "src.flows.legicem_checkup.send_email",
        return_value={"legicem.checkup@email.fr": (550, "User unknown")},
    ):
        state = legicem_checkup_flow(is_integration=False, return_state=True)

    assert state.is_failed()


def test_flow_fails_when_recipient_is_not_set(insert_legicem_references):
    with patch(
        "src.flows.legicem_checkup.LEGICEM_CHECKUP_EMAIL_ADDRESS", None
    ), patch("src.flows.legicem_checkup.send_email") as mock_send_email:
        state = legicem_checkup_flow(is_integration=False, return_state=True)

    assert state.is_failed()
    mock_send_email.assert_not_called()


def test_flow_does_not_send_email_when_nothing_changed(no_change_in_legicem):
    with patch("src.flows.legicem_checkup.send_email") as mock_send_email:
        state = legicem_checkup_flow(is_integration=False, return_state=True)

    assert state.is_completed()
    assert state.result() is None
    mock_send_email.assert_not_called()
