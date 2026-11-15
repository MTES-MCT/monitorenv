"""
Manual tests that send REAL emails, to check that the Legicem emails are
actually delivered and look right in a mail client.

They are skipped unless the following environment variables are set, so they
never run in CI :

  - LEGICEM_REAL_EMAIL_TEST_TO : address receiving the test emails
  - EMAIL_SERVER_URL, EMAIL_SERVER_PORT : SMTP server to use
  - LEGICEM_REAL_EMAIL_TEST_FROM (optional) : sender address accepted by the
    SMTP server. Defaults to `MONITORENV_SENDER_EMAIL_ADDRESS` of `.env.test`.

Example, from a machine that can reach the SMTP server :

    cd pipeline
    export TEST=True
    export LEGICEM_REAL_EMAIL_TEST_TO=prenom.nom@mer.gouv.fr
    export EMAIL_SERVER_URL=smtp.example.gouv.fr EMAIL_SERVER_PORT=25
    export LEGICEM_REAL_EMAIL_TEST_FROM=monitorenv@example.gouv.fr
    poetry run pytest -v -s tests/test_flows/test_legicem_real_emails.py

Two emails are sent : a Legicem checkup email and a scraping failure alert.
"""

import datetime
import os
from contextlib import ExitStack
from pathlib import Path
from unittest.mock import patch

import pytest
from prefect import task

from src.flows.legicem_checkup import legicem_checkup_flow
from src.flows.scrape_legicem import scrape_legicem_flow
from src.helpers.emails import send_email as real_send_email

REAL_EMAIL_TO = os.getenv("LEGICEM_REAL_EMAIL_TEST_TO")
EMAIL_SERVER_URL = os.getenv("EMAIL_SERVER_URL")
EMAIL_SERVER_PORT = os.getenv("EMAIL_SERVER_PORT", "25")
EMAIL_FROM = os.getenv("LEGICEM_REAL_EMAIL_TEST_FROM")

pytestmark = pytest.mark.skipif(
    not (REAL_EMAIL_TO and EMAIL_SERVER_URL),
    reason=(
        "Real email tests : set LEGICEM_REAL_EMAIL_TEST_TO and "
        "EMAIL_SERVER_URL to run them."
    ),
)


@pytest.fixture
def real_smtp_server():
    """Points the email helpers at the SMTP server given in the environment."""
    with ExitStack() as stack:
        stack.enter_context(
            patch("src.helpers.emails.EMAIL_SERVER_URL", EMAIL_SERVER_URL)
        )
        stack.enter_context(
            patch("src.helpers.emails.EMAIL_SERVER_PORT", EMAIL_SERVER_PORT)
        )
        if EMAIL_FROM:
            for module in ("legicem_checkup", "scrape_legicem"):
                stack.enter_context(
                    patch(
                        f"src.flows.{module}.MONITORENV_SENDER_EMAIL_ADDRESS",
                        EMAIL_FROM,
                    )
                )
        yield


@task
def mock_scrape_legicem_to_csv_empty(filepath: Path) -> datetime.datetime:
    filepath.parent.mkdir(parents=True, exist_ok=True)
    filepath.touch()
    return datetime.datetime.now(datetime.timezone.utc).replace(tzinfo=None)


def test_send_real_legicem_checkup_email(reset_test_data, real_smtp_server):
    state = legicem_checkup_flow(
        is_integration=False,
        email_address=REAL_EMAIL_TO,
        send_if_no_change=True,
        return_state=True,
    )
    assert state.is_completed()
    print(f"Legicem checkup email sent to {REAL_EMAIL_TO}.")


@patch(
    "src.flows.scrape_legicem.scrape_legicem_to_csv",
    mock_scrape_legicem_to_csv_empty,
)
def test_send_real_scrape_failure_alert(
    reset_test_data, real_smtp_server, tmp_path
):
    # The failure hook logs sending errors instead of raising them, so the
    # outcome of the real sending is recorded to be checked below.
    send_outcomes = []

    def recording_send_email(message):
        try:
            send_errors = real_send_email(message)
        except Exception as e:
            send_outcomes.append(e)
            raise
        send_outcomes.append(send_errors)
        return send_errors

    with patch(
        "src.flows.scrape_legicem.SCRAPED_FILEPATH", tmp_path / "legicem.csv"
    ), patch(
        "src.flows.scrape_legicem.send_email", recording_send_email
    ):
        state = scrape_legicem_flow(
            is_integration=False,
            email_address=REAL_EMAIL_TO,
            return_state=True,
        )

    # The scraping fails on purpose, which triggers the alert
    assert state.is_failed()
    # The alert was sent once and accepted by the SMTP server
    assert send_outcomes == [{}]
    print(f"Legicem scraping failure alert sent to {REAL_EMAIL_TO}.")
