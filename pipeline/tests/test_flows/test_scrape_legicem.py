import datetime
import shutil
from pathlib import Path
from unittest.mock import patch

import pandas as pd
import pytest
from prefect import task

from config import TEST_DATA_LOCATION
from src.flows.scrape_legicem import (
    FAILURE_EMAIL_SUBJECT,
    create_scrape_failure_email,
    read_legicem_csv,
    scrape_legicem_flow,
)
from src.read_query import read_query

LEGICEM_URL = "https://legicem.metier.e2.rie.gouv.fr"

LEGICEM_QUERY = """
SELECT
    extraction_datetime_utc,
    extraction_occurence::VARCHAR AS extraction_occurence,
    page_title,
    page_url,
    document_title,
    document_url
FROM legicem
ORDER BY extraction_occurence, page_url, document_url
"""

MOCK_EXTRACTION_DATETIME_UTC = datetime.datetime(2026, 10, 23, 3, 15)


@task
def mock_scrape_legicem_to_csv(filepath: Path) -> datetime.datetime:
    filepath.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy(TEST_DATA_LOCATION / "legicem" / "legicem.csv", filepath)
    return MOCK_EXTRACTION_DATETIME_UTC


@task
def mock_scrape_legicem_to_csv_empty(filepath: Path) -> datetime.datetime:
    # Scrapy writes an empty file when the spider yields no item
    filepath.parent.mkdir(parents=True, exist_ok=True)
    filepath.touch()
    return MOCK_EXTRACTION_DATETIME_UTC


def read_legicem_table() -> pd.DataFrame:
    res = read_query("monitorenv_remote", LEGICEM_QUERY)
    res["extraction_datetime_utc"] = res.extraction_datetime_utc.astype(str)
    return res


@pytest.fixture
def initial_legicem() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "extraction_datetime_utc": [
                "2026-10-22 03:15:00",
                "2026-10-22 03:15:00",
                "2026-10-21 03:15:00",
                "2026-10-21 03:15:00",
            ],
            "extraction_occurence": ["latest", "latest", "previous", "previous"],
            "page_title": [
                "Arrêté préfectoral mouillages",
                "Arrêté zone de baignade",
                "Ancien arrêté supprimé",
                "Arrêté préfectoral mouillages",
            ],
            "page_url": [
                f"{LEGICEM_URL}/arrete-prefectoral-mouillages-a101.html",
                f"{LEGICEM_URL}/arrete-zone-de-baignade-a102.html",
                f"{LEGICEM_URL}/ancien-arrete-a050.html",
                f"{LEGICEM_URL}/arrete-prefectoral-mouillages-a101.html",
            ],
            "document_title": [
                "Arrêté n°2026-101 - PDF",
                None,
                None,
                "Arrêté n°2025-087 - PDF",
            ],
            "document_url": [
                f"{LEGICEM_URL}/IMG/pdf/arrete_mouillages_2026.pdf",
                None,
                None,
                f"{LEGICEM_URL}/IMG/pdf/arrete_mouillages_2025.pdf",
            ],
        }
    )


@pytest.fixture
def expected_final_legicem() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "extraction_datetime_utc": [
                "2026-10-23 03:15:00",
                "2026-10-23 03:15:00",
                "2026-10-23 03:15:00",
                "2026-10-22 03:15:00",
                "2026-10-22 03:15:00",
            ],
            "extraction_occurence": [
                "latest",
                "latest",
                "latest",
                "previous",
                "previous",
            ],
            "page_title": [
                "Arrêté préfectoral mouillages",
                "Arrêté préfectoral mouillages",
                "Arrêté zone de baignade",
                "Arrêté préfectoral mouillages",
                "Arrêté zone de baignade",
            ],
            "page_url": [
                f"{LEGICEM_URL}/arrete-prefectoral-mouillages-a101.html",
                f"{LEGICEM_URL}/arrete-prefectoral-mouillages-a101.html",
                f"{LEGICEM_URL}/arrete-zone-de-baignade-a102.html",
                f"{LEGICEM_URL}/arrete-prefectoral-mouillages-a101.html",
                f"{LEGICEM_URL}/arrete-zone-de-baignade-a102.html",
            ],
            "document_title": [
                "Annexe cartographique - PDF",
                "Arrêté n°2026-101 - PDF",
                None,
                "Arrêté n°2026-101 - PDF",
                None,
            ],
            "document_url": [
                f"{LEGICEM_URL}/IMG/pdf/annexe_carte.pdf",
                f"{LEGICEM_URL}/IMG/pdf/arrete_mouillages_2026.pdf",
                None,
                f"{LEGICEM_URL}/IMG/pdf/arrete_mouillages_2026.pdf",
                None,
            ],
        }
    )


def test_read_legicem_csv(tmp_path):
    filepath = tmp_path / "legicem.csv"
    shutil.copy(TEST_DATA_LOCATION / "legicem" / "legicem.csv", filepath)

    legicem = read_legicem_csv.fn(filepath, MOCK_EXTRACTION_DATETIME_UTC)

    assert list(legicem.columns) == [
        "page_title",
        "page_url",
        "document_title",
        "document_url",
        "extraction_datetime_utc",
        "extraction_occurence",
    ]
    assert len(legicem) == 3
    assert (
        legicem.extraction_datetime_utc == MOCK_EXTRACTION_DATETIME_UTC
    ).all()
    assert (legicem.extraction_occurence == "latest").all()
    assert legicem.document_url.isna().tolist() == [False, False, True]


def test_read_legicem_csv_raises_if_file_is_missing(tmp_path):
    with pytest.raises(ValueError, match="missing or empty"):
        read_legicem_csv.fn(
            tmp_path / "legicem.csv", MOCK_EXTRACTION_DATETIME_UTC
        )


def test_read_legicem_csv_raises_if_file_is_empty(tmp_path):
    filepath = tmp_path / "legicem.csv"
    filepath.touch()
    with pytest.raises(ValueError, match="missing or empty"):
        read_legicem_csv.fn(filepath, MOCK_EXTRACTION_DATETIME_UTC)


def test_read_legicem_csv_raises_if_file_has_no_rows(tmp_path):
    filepath = tmp_path / "legicem.csv"
    filepath.write_text("page_title,page_url,document_title,document_url\n")
    with pytest.raises(ValueError, match="no rows"):
        read_legicem_csv.fn(filepath, MOCK_EXTRACTION_DATETIME_UTC)


@patch(
    "src.flows.scrape_legicem.scrape_legicem_to_csv",
    mock_scrape_legicem_to_csv,
)
def test_flow(
    reset_test_data, tmp_path, initial_legicem, expected_final_legicem
):
    pd.testing.assert_frame_equal(read_legicem_table(), initial_legicem)

    with patch(
        "src.flows.scrape_legicem.SCRAPED_FILEPATH", tmp_path / "legicem.csv"
    ):
        state = scrape_legicem_flow(return_state=True)

    assert state.is_completed()
    pd.testing.assert_frame_equal(
        read_legicem_table(), expected_final_legicem
    )


@patch(
    "src.flows.scrape_legicem.scrape_legicem_to_csv",
    mock_scrape_legicem_to_csv_empty,
)
def test_flow_keeps_data_when_scraping_yields_nothing(
    reset_test_data, tmp_path, initial_legicem
):
    with patch(
        "src.flows.scrape_legicem.SCRAPED_FILEPATH", tmp_path / "legicem.csv"
    ):
        state = scrape_legicem_flow(return_state=True)

    assert state.is_failed()
    pd.testing.assert_frame_equal(read_legicem_table(), initial_legicem)


################################ Failure alert ################################


def test_create_scrape_failure_email():
    message = create_scrape_failure_email(
        to="legicem.checkup@email.fr",
        error_message="ValueError: legicem.csv contains <no> rows",
        flow_run_name="vigilant-lobster",
        failure_datetime_utc=datetime.datetime(2026, 10, 27, 4, 15),
    )

    assert message["Subject"] == FAILURE_EMAIL_SUBJECT
    assert message["To"] == "legicem.checkup@email.fr"
    assert message["From"] == "monitorenv@email.fr"

    html_content = message.get_content()
    assert "27/10/2026 05:15" in html_content
    assert "vigilant-lobster" in html_content
    # The error message is html-escaped
    assert "legicem.csv contains &lt;no&gt; rows" in html_content


@patch(
    "src.flows.scrape_legicem.scrape_legicem_to_csv",
    mock_scrape_legicem_to_csv_empty,
)
def test_flow_sends_alert_when_scraping_fails(reset_test_data, tmp_path):
    with patch(
        "src.flows.scrape_legicem.SCRAPED_FILEPATH", tmp_path / "legicem.csv"
    ), patch(
        "src.flows.scrape_legicem.send_email", return_value={}
    ) as mock_send_email:
        state = scrape_legicem_flow(is_integration=False, return_state=True)

    assert state.is_failed()
    mock_send_email.assert_called_once()
    message = mock_send_email.call_args.args[0]
    assert message["Subject"] == FAILURE_EMAIL_SUBJECT
    assert message["To"] == "legicem.checkup@email.fr"
    # The error of the failed flow run is included in the alert
    assert "legicem.csv is missing or empty" in message.get_content()


@patch(
    "src.flows.scrape_legicem.scrape_legicem_to_csv",
    mock_scrape_legicem_to_csv_empty,
)
def test_flow_sends_alert_to_email_address_parameter(
    reset_test_data, tmp_path
):
    with patch(
        "src.flows.scrape_legicem.SCRAPED_FILEPATH", tmp_path / "legicem.csv"
    ), patch(
        "src.flows.scrape_legicem.send_email", return_value={}
    ) as mock_send_email:
        state = scrape_legicem_flow(
            is_integration=False,
            email_address="someone@email.fr",
            return_state=True,
        )

    assert state.is_failed()
    message = mock_send_email.call_args.args[0]
    assert message["To"] == "someone@email.fr"


@patch(
    "src.flows.scrape_legicem.scrape_legicem_to_csv",
    mock_scrape_legicem_to_csv_empty,
)
def test_flow_does_not_send_alert_in_integration(reset_test_data, tmp_path):
    with patch(
        "src.flows.scrape_legicem.SCRAPED_FILEPATH", tmp_path / "legicem.csv"
    ), patch("src.flows.scrape_legicem.send_email") as mock_send_email:
        state = scrape_legicem_flow(is_integration=True, return_state=True)

    assert state.is_failed()
    mock_send_email.assert_not_called()


@patch(
    "src.flows.scrape_legicem.scrape_legicem_to_csv",
    mock_scrape_legicem_to_csv,
)
def test_flow_does_not_send_alert_when_scraping_succeeds(
    reset_test_data, tmp_path
):
    with patch(
        "src.flows.scrape_legicem.SCRAPED_FILEPATH", tmp_path / "legicem.csv"
    ), patch("src.flows.scrape_legicem.send_email") as mock_send_email:
        state = scrape_legicem_flow(is_integration=False, return_state=True)

    assert state.is_completed()
    mock_send_email.assert_not_called()


@patch(
    "src.flows.scrape_legicem.scrape_legicem_to_csv",
    mock_scrape_legicem_to_csv_empty,
)
def test_alert_failure_does_not_hide_scraping_failure(
    reset_test_data, tmp_path
):
    with patch(
        "src.flows.scrape_legicem.SCRAPED_FILEPATH", tmp_path / "legicem.csv"
    ), patch(
        "src.flows.scrape_legicem.send_email",
        side_effect=ConnectionRefusedError("SMTP server unreachable"),
    ):
        state = scrape_legicem_flow(is_integration=False, return_state=True)

    # The flow run is still failed because of the scraping, not of the alert
    assert state.is_failed()
    with pytest.raises(ValueError, match="Legicem scraping failed"):
        state.result()
