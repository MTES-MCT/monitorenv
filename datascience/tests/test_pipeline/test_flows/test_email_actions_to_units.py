import dataclasses
from datetime import datetime
from email.message import EmailMessage
from smtplib import SMTPDataError
from typing import List
from unittest.mock import patch
from uuid import UUID

import pandas as pd
import pytest
from jinja2 import Template

from config import (
    CACEM_EMAIL_ADDRESS,
    MONITORENV_SENDER_EMAIL_ADDRESS,
    TEST_DATA_LOCATION,
)
from src.pipeline.entities.actions_emailing import (
    ControlUnit,
    ControlUnitActions,
    ControlUnitActionsSentMessage,
)
from src.pipeline.flows.email_actions_to_units import (
    control_unit_actions_list_to_df,
    create_email,
    extract_all_control_units,
    extract_control_units,
    extract_env_actions,
    flow,
    get_actions_period,
    get_control_unit_ids,
    get_template,
    load_emails_sent_to_control_units,
    render,
    send_env_actions_email,
    to_control_unit_actions,
)
from src.pipeline.helpers.dates import Period
from src.read_query import read_query
from tests.mocks import mock_check_flow_not_running

flow.replace(
    flow.get_tasks("check_flow_not_running")[0], mock_check_flow_not_running
)


@pytest.fixture
def expected_env_actions() -> pd.DataFrame:

    return pd.DataFrame(
        {
            "id": [
                UUID("88713755-3966-4ca4-ae18-10cab6249485"),
                UUID("d8e580fe-8e71-4303-a0c3-a76e1d4e4fc2"),
                UUID("d8e580fe-8e71-4303-a0c3-a76e1d4e4fc2"),
                UUID("dfb9710a-2217-4f98-94dc-283d3b7bbaae"),
                UUID("dfb9710a-2217-4f98-94dc-283d3b7bbaae"),
            ],
            "action_start_datetime_utc": [
                datetime(
                    year=2022,
                    month=6,
                    day=28,
                    hour=13,
                    minute=59,
                    second=20,
                    microsecond=176000,
                ),
                datetime(
                    year=2022,
                    month=11,
                    day=24,
                    hour=20,
                    minute=31,
                    second=41,
                    microsecond=719000,
                ),
                datetime(
                    year=2022,
                    month=11,
                    day=24,
                    hour=20,
                    minute=31,
                    second=41,
                    microsecond=719000,
                ),
                datetime(
                    year=2022,
                    month=11,
                    day=20,
                    hour=20,
                    minute=31,
                    second=41,
                    microsecond=719000,
                ),
                datetime(
                    year=2022,
                    month=11,
                    day=20,
                    hour=20,
                    minute=31,
                    second=41,
                    microsecond=719000,
                ),
            ],
            "action_end_datetime_utc": [
                datetime(
                    year=2022,
                    month=7,
                    day=5,
                    hour=19,
                    minute=59,
                    second=20,
                    microsecond=176000,
                ),
                pd.NaT,
                pd.NaT,
                datetime(
                    year=2022,
                    month=11,
                    day=20,
                    hour=23,
                    minute=31,
                    second=41,
                    microsecond=719000,
                ),
                datetime(
                    year=2022,
                    month=11,
                    day=20,
                    hour=23,
                    minute=31,
                    second=41,
                    microsecond=719000,
                ),
            ],
            "mission_type": ["SEA", "SEA", "SEA", "SEA", "SEA"],
            "action_type": [
                "SURVEILLANCE",
                "CONTROL",
                "CONTROL",
                "SURVEILLANCE",
                "SURVEILLANCE",
            ],
            "control_unit_id": [10019, 10018, 10019, 10018, 10019],
            "action_facade": [
                "Hors façade",
                "Hors façade",
                "Hors façade",
                "Hors façade",
                "Hors façade",
            ],
            "action_department": [
                "Hors département",
                "Hors département",
                "Hors département",
                "Hors département",
                "Hors département",
            ],
            "infraction": [None, False, False, None, None],
            "number_of_controls": [None, 0.0, 0.0, None, None],
            "surveillance_duration": [174.0, None, None, 3.0, 3.0],
            "is_late_update": [True, False, False, False, False],
            "themes": [
                {
                    "Culture marine": ["Implantation"],
                    "Police des espèces protégées et de leurs habitats (faune et flore)": [
                        "Dérogations concernant les espèces protégées",
                        "Détention d'espèces protégées",
                    ],
                },
                {"Aucun thème": ["Aucun sous-thème"]},
                {"Aucun thème": ["Aucun sous-thème"]},
                {"EIN2000": ["Aucun sous-thème"]},
                {"EIN2000": ["Aucun sous-thème"]},
            ],
            "longitude": [None, -3.0193, -3.0193, None, None],
            "latitude": [None, 48.12065, 48.12065, None, None],
        }
    )


@pytest.fixture
def expected_control_unit_ids() -> List[int]:
    return [10018, 10019]


@pytest.fixture
def expected_control_units() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "control_unit_id": [10018, 10019],
            "control_unit_name": ["P602 Verdon", "BN Toulon"],
            "email_addresses": [
                ["diffusion.p602@email.fr", "diffusion_bis.p602@email.fr"],
                ["bn_toulon@email.fr"],
            ],
        }
    )


@pytest.fixture
def expected_all_control_units() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "control_unit_id": [10002, 10018, 10019],
            "control_unit_name": ["DML – DDTM 59", "P602 Verdon", "BN Toulon"],
            "email_addresses": [
                ["dml59@surveillance.fr"],
                ["diffusion.p602@email.fr", "diffusion_bis.p602@email.fr"],
                ["bn_toulon@email.fr"],
            ],
        }
    )


@pytest.fixture
def sample_control_unit_actions() -> ControlUnitActions:
    return ControlUnitActions(
        control_unit=ControlUnit(
            control_unit_id=13,
            control_unit_name="Nom de l'unité",
            email_addresses=["email@email.com", "email2@email.com"],
        ),
        period=Period(
            start=datetime(2020, 6, 23, 0, 0, 0),
            end=datetime(2020, 5, 6, 18, 45, 6),
        ),
        controls=pd.DataFrame(
            {
                "id": [UUID("d8e580fe-8e71-4303-a0c3-a76e1d4e4fc2")],
                "action_start_datetime_utc": [
                    datetime(2022, 11, 24, 20, 31, 41, 719000)
                ],
                "action_end_datetime_utc": [pd.NaT],
                "mission_type": ["SEA"],
                "action_type": ["CONTROL"],
                "control_unit_id": [10019],
                "action_facade": ["Hors façade"],
                "action_department": ["Hors département"],
                "infraction": [False],
                "number_of_controls": [0.0],
                "surveillance_duration": [None],
                "themes": [{"Aucun thème": ["Aucun sous-thème"]}],
                "longitude": [-3.0193],
                "latitude": [48.12065],
            }
        ),
        surveillances=pd.DataFrame(
            {
                "id": [
                    UUID("88713755-3966-4ca4-ae18-10cab6249485"),
                    UUID("dfb9710a-2217-4f98-94dc-283d3b7bbaae"),
                ],
                "action_start_datetime_utc": [
                    datetime(2022, 11, 28, 13, 59, 20, 176000),
                    datetime(2022, 11, 20, 20, 31, 41, 719000),
                ],
                "action_end_datetime_utc": [
                    datetime(2022, 12, 5, 19, 59, 20, 176000),
                    datetime(2022, 11, 20, 23, 31, 41, 719000),
                ],
                "mission_type": ["SEA", "SEA"],
                "action_type": ["SURVEILLANCE", "SURVEILLANCE"],
                "control_unit_id": [10019, 10019],
                "action_facade": ["Hors façade", "Hors façade"],
                "action_department": ["Hors département", "Hors département"],
                "infraction": [None, None],
                "number_of_controls": [None, None],
                "surveillance_duration": [174.0, 3.0],
                "themes": [
                    {
                        "Culture marine": ["Implantation"],
                        "Police des espèces protégées et de leurs habitats (faune et flore)": [
                            "Dérogations concernant les espèces protégées",
                            "Détention d'espèces protégées",
                        ],
                    },
                    {
                        "Activités et manifestations soumises à évaluation d’incidence Natura 2000": [
                            "Aucun sous-thème"
                        ]
                    },
                ],
                "longitude": [None, None],
                "latitude": [None, None],
            }
        ),
        late_controls=pd.DataFrame(
            {
                "id": [UUID("394a0c7e-e8df-4a90-bb5a-35594a0db694")],
                "action_start_datetime_utc": [
                    datetime(2022, 11, 24, 20, 31, 41, 719000)
                ],
                "action_end_datetime_utc": [pd.NaT],
                "mission_type": ["SEA"],
                "action_type": ["CONTROL"],
                "control_unit_id": [10019],
                "action_facade": ["Hors façade"],
                "action_department": ["Hors département"],
                "infraction": [False],
                "number_of_controls": [0.0],
                "surveillance_duration": [None],
                "themes": [{"Aucun thème": ["Aucun sous-thème"]}],
                "longitude": [-1.0193],
                "latitude": [28.12065],
            }
        ),
        late_surveillances=pd.DataFrame(
            {
                "id": [
                    UUID("a1e11c27-faab-49f6-bc2e-d7ffa0864ca2"),
                ],
                "action_start_datetime_utc": [
                    datetime(2022, 11, 28, 13, 59, 20, 176000),
                ],
                "action_end_datetime_utc": [
                    datetime(2022, 12, 5, 19, 59, 20, 176000),
                ],
                "mission_type": ["SEA"],
                "action_type": ["SURVEILLANCE"],
                "control_unit_id": [10019],
                "action_facade": ["Hors façade"],
                "action_department": ["Hors département"],
                "infraction": [None],
                "number_of_controls": [None],
                "surveillance_duration": [54.0],
                "themes": [
                    {
                        "Culture marine": ["Implantation"],
                        "Police des espèces protégées et de leurs habitats (faune et flore)": [
                            "Dérogations concernant les espèces protégées",
                            "Détention d'espèces protégées",
                        ],
                    },
                ],
                "longitude": [None],
                "latitude": [None],
            }
        ),
    )


@pytest.fixture
def sample_control_unit_actions_without_actions(
    sample_control_unit_actions,
) -> ControlUnitActions:
    return dataclasses.replace(
        sample_control_unit_actions,
        controls=sample_control_unit_actions.controls.head(0),
        surveillances=sample_control_unit_actions.surveillances.head(0),
        late_controls=sample_control_unit_actions.late_controls.head(0),
        late_surveillances=sample_control_unit_actions.late_surveillances.head(
            0
        ),
    )


@pytest.fixture
def control_unit_actions_sent_messages() -> List[
    ControlUnitActionsSentMessage
]:

    return [
        ControlUnitActionsSentMessage(
            control_unit_id=13,
            control_unit_name="Nom de l'unité",
            email_address="email@email.com",
            sending_datetime_utc=datetime(2024, 3, 19, 14, 37, 24, 497093),
            actions_min_datetime_utc=datetime(2020, 6, 23, 0, 0),
            actions_max_datetime_utc=datetime(2020, 5, 6, 18, 45, 6),
            number_of_actions=2,
            success=True,
            error_code=None,
            error_message=None,
        ),
        ControlUnitActionsSentMessage(
            control_unit_id=13,
            control_unit_name="Nom de l'unité",
            email_address="email2@email.com",
            sending_datetime_utc=datetime(2024, 3, 19, 14, 37, 24, 497093),
            actions_min_datetime_utc=datetime(2020, 6, 23, 0, 0),
            actions_max_datetime_utc=datetime(2020, 5, 6, 18, 45, 6),
            number_of_actions=2,
            success=False,
            error_code=550,
            error_message="Email cound not be sent.",
        ),
    ]


@pytest.fixture
def control_unit_actions_sent_messages_df() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "control_unit_id": [13, 13],
            "control_unit_name": ["Nom de l'unité", "Nom de l'unité"],
            "email_address": ["email@email.com", "email2@email.com"],
            "sending_datetime_utc": [
                datetime(
                    year=2024,
                    month=3,
                    day=19,
                    hour=14,
                    minute=37,
                    second=24,
                    microsecond=497093,
                ),
                datetime(
                    year=2024,
                    month=3,
                    day=19,
                    hour=14,
                    minute=37,
                    second=24,
                    microsecond=497093,
                ),
            ],
            "actions_min_datetime_utc": [
                datetime(
                    year=2020, month=6, day=23, hour=00, minute=00, second=00
                ),
                datetime(
                    year=2020, month=6, day=23, hour=00, minute=00, second=00
                ),
            ],
            "actions_max_datetime_utc": [
                datetime(
                    year=2020, month=5, day=6, hour=18, minute=45, second=6
                ),
                datetime(
                    year=2020, month=5, day=6, hour=18, minute=45, second=6
                ),
            ],
            "number_of_actions": [2, 2],
            "success": [True, False],
            "error_code": [None, 550.0],
            "error_message": [None, "Email cound not be sent."],
        }
    )


@pytest.fixture
def expected_email(sample_control_unit_actions) -> EmailMessage:

    email = EmailMessage()
    email["Subject"] = "Bilan hebdomadaire contrôle de l'environnement marin"
    email["From"] = MONITORENV_SENDER_EMAIL_ADDRESS
    email["To"] = ", ".join(
        sample_control_unit_actions.control_unit.email_addresses
    )
    email["Reply-To"] = CACEM_EMAIL_ADDRESS
    email.set_content(
        "<html>Bonjour ceci est un email test.</html>\n", subtype="html"
    )

    return email


def test_get_actions_period():
    period = get_actions_period.run(
        utcnow=datetime(2021, 2, 21, 16, 10, 0),
        start_days_ago=5,
        end_days_ago=2,
    )
    assert period == Period(
        start=datetime(2021, 2, 16, 0, 0), end=datetime(2021, 2, 20, 0, 0)
    )


def test_extract_env_actions(reset_test_data, expected_env_actions):
    # Dates with some data
    actions = extract_env_actions.run(
        period=Period(start=datetime(2022, 10, 1), end=datetime(2022, 12, 6))
    )
    assert len(actions) == 5
    assert set(actions.id.unique()) == set(
        {
            UUID("dfb9710a-2217-4f98-94dc-283d3b7bbaae"),
            UUID("88713755-3966-4ca4-ae18-10cab6249485"),
            UUID("d8e580fe-8e71-4303-a0c3-a76e1d4e4fc2"),
        }
    )
    pd.testing.assert_frame_equal(actions, expected_env_actions)

    # Dates without data
    actions = extract_env_actions.run(
        period=Period(start=datetime(2023, 10, 1), end=datetime(2023, 12, 6))
    )
    assert len(actions) == 0


def test_get_control_unit_ids(expected_env_actions, expected_control_unit_ids):
    ids = get_control_unit_ids.run(expected_env_actions)
    assert ids == expected_control_unit_ids
    id_types = set(map(type, ids))

    # Type int required by psycopg2, which cannot handle numpy.int64
    assert id_types == {int}


def test_extract_control_units(
    reset_test_data, expected_control_unit_ids, expected_control_units
):
    units = extract_control_units.run(
        control_unit_ids=expected_control_unit_ids
    )
    units["email_addresses"] = units.email_addresses.map(sorted)
    pd.testing.assert_frame_equal(units, expected_control_units)


def test_extract_all_control_units(
    reset_test_data, expected_all_control_units
):
    units = extract_all_control_units.run()
    units["email_addresses"] = units.email_addresses.map(sorted)

    pd.testing.assert_frame_equal(units, expected_all_control_units)


def test_to_control_unit_actions(expected_env_actions, expected_control_units):

    period = Period(
        start=datetime(1996, 6, 11, 2, 52, 36),
        end=datetime(1996, 6, 13, 6, 17, 18),
    )

    control_unit_actions = to_control_unit_actions.run(
        env_actions=expected_env_actions,
        period=period,
        control_units=expected_control_units,
    )

    assert len(control_unit_actions) == 2

    assert isinstance(control_unit_actions[0], ControlUnitActions)
    assert control_unit_actions[0].control_unit.control_unit_id == 10018
    assert control_unit_actions[0].period == period
    pd.testing.assert_frame_equal(
        control_unit_actions[0].controls,
        expected_env_actions.iloc[[1]].reset_index(drop=True),
    )
    pd.testing.assert_frame_equal(
        control_unit_actions[0].surveillances,
        expected_env_actions.iloc[[3]].reset_index(drop=True),
    )

    assert control_unit_actions[1].control_unit.control_unit_id == 10019
    assert control_unit_actions[1].period == period
    pd.testing.assert_frame_equal(
        control_unit_actions[1].controls,
        expected_env_actions.iloc[[2]].reset_index(drop=True),
    )
    pd.testing.assert_frame_equal(
        control_unit_actions[1].surveillances,
        expected_env_actions.iloc[[4]].reset_index(drop=True),
    )
    pd.testing.assert_frame_equal(
        control_unit_actions[1].late_surveillances,
        expected_env_actions.iloc[[0]].reset_index(drop=True),
    )


def test_get_template():
    template = get_template.run()
    assert isinstance(template, Template)


def test_render(sample_control_unit_actions):
    template = get_template.run()
    html = render.run(
        control_unit_actions=sample_control_unit_actions, template=template
    )

    # Uncomment to update the expected html file
    # with open(TEST_DATA_LOCATION / "emails/expected_rendered_email.html", "w") as f:
    #     f.write(html)

    with open(
        TEST_DATA_LOCATION / "emails/expected_rendered_email.html", "r"
    ) as f:
        expected_html = f.read()

    assert html == expected_html


def test_render_when_unit_as_no_actions(
    sample_control_unit_actions_without_actions,
):
    template = get_template.run()
    html = render.run(
        control_unit_actions=sample_control_unit_actions_without_actions,
        template=template,
    )

    # Uncomment to update the expected html file
    # with open(
    #     TEST_DATA_LOCATION / "emails/expected_rendered_email_without_actions.html", "w"
    # ) as f:
    #     f.write(html)

    with open(
        TEST_DATA_LOCATION
        / "emails/expected_rendered_email_without_actions.html",
        "r",
    ) as f:
        expected_html = f.read()

    assert html == expected_html


@pytest.mark.parametrize("test_mode", [False, True])
def test_create_email(sample_control_unit_actions, expected_email, test_mode):

    email = create_email.run(
        html="<html>Bonjour ceci est un email test.</html>",
        actions=sample_control_unit_actions,
        test_mode=test_mode,
    )

    assert email["Subject"] == expected_email["Subject"]
    assert email["From"] == expected_email["From"]
    assert (
        email["To"] == CACEM_EMAIL_ADDRESS
        if test_mode
        else expected_email["To"]
    )
    assert email["Reply-To"] == expected_email["Reply-To"]
    assert email.get_content_type() == expected_email.get_content_type()

    body = email.get_body()
    expected_body = expected_email.get_body()
    assert body.get_content_type() == expected_body.get_content_type()

    assert body.get_charsets() == expected_body.get_charsets()
    assert body.get_content() == expected_body.get_content()


@pytest.mark.parametrize(
    "is_integration,send_email_outcome",
    [
        (False, SMTPDataError(100, "Erreur SMTP")),
        (False, dict()),
        (False, {"email2@email.com": (550, "Email cound not be sent.")}),
        (True, Exception("Autre erreur")),
    ],
)
@patch("src.pipeline.flows.email_actions_to_units.send_email")
@patch("src.pipeline.flows.email_actions_to_units.sleep")
def test_send_env_actions_email(
    mock_sleep,
    mock_send_email,
    expected_email,
    sample_control_unit_actions,
    is_integration,
    send_email_outcome,
):
    def send_email_side_effect(message):
        if isinstance(send_email_outcome, Exception):
            raise send_email_outcome
        else:
            return send_email_outcome

    mock_send_email.side_effect = send_email_side_effect

    sent_messages = send_env_actions_email.run(
        message=expected_email,
        actions=sample_control_unit_actions,
        is_integration=is_integration,
    )
    assert len(sent_messages) == 2
    for msg in sent_messages:
        success = True
        error_code = None
        error_message = None
        addressee = msg.email_address
        if not is_integration:
            if isinstance(send_email_outcome, SMTPDataError):
                success = False
                error_message = (
                    "The server replied with an unexpected error code "
                    "(other than a refusal of a recipient)."
                )
            else:
                if msg.email_address in send_email_outcome:
                    success = False
                    error_code, error_message = send_email_outcome[addressee]
        assert isinstance(msg, ControlUnitActionsSentMessage)
        assert (
            msg.control_unit_id
            == sample_control_unit_actions.control_unit.control_unit_id
        )
        assert (
            msg.control_unit_name
            == sample_control_unit_actions.control_unit.control_unit_name
        )
        assert msg.email_address == addressee
        assert (
            msg.actions_min_datetime_utc
            == sample_control_unit_actions.period.start
        )
        assert (
            msg.actions_max_datetime_utc
            == sample_control_unit_actions.period.end
        )
        assert msg.number_of_actions == len(
            sample_control_unit_actions.controls
        ) + len(sample_control_unit_actions.surveillances) + len(
            sample_control_unit_actions.late_controls
        ) + len(
            sample_control_unit_actions.late_surveillances
        )
        assert msg.success == success
        assert msg.error_code == error_code
        assert msg.error_message == error_message


def test_control_unit_actions_list_to_df(
    control_unit_actions_sent_messages, control_unit_actions_sent_messages_df
):

    df = control_unit_actions_list_to_df.run(
        control_unit_actions_sent_messages
    )
    pd.testing.assert_frame_equal(df, control_unit_actions_sent_messages_df)


def test_load_emails_sent_to_control_units(
    reset_test_data, control_unit_actions_sent_messages_df
):

    query = "SELECT * FROM emails_sent_to_control_units ORDER BY email_address"

    initial_emails = read_query(db="monitorenv_remote", query=query)

    load_emails_sent_to_control_units.run(
        control_unit_actions_sent_messages_df
    )
    emails_after_one_run = read_query(db="monitorenv_remote", query=query)

    load_emails_sent_to_control_units.run(
        control_unit_actions_sent_messages_df
    )
    emails_after_two_runs = read_query(db="monitorenv_remote", query=query)

    assert len(initial_emails) == 0
    assert len(emails_after_one_run) == len(emails_after_two_runs) == 2
    pd.testing.assert_frame_equal(
        emails_after_one_run.drop(columns=["id"]),
        emails_after_two_runs.drop(columns=["id"]),
    )


@pytest.mark.parametrize(
    "email_all_units,expected_number_of_sent_emails", [(True, 4), (False, 3)]
)
def test_flow(
    reset_test_data, email_all_units, expected_number_of_sent_emails
):
    now = datetime.utcnow()
    d1 = datetime(2022, 10, 1)
    d2 = datetime(2022, 12, 6)
    start_days_ago = int((now - d1).total_seconds() / 60 / 60 / 24) + 1
    end_days_ago = int((now - d2).total_seconds() / 60 / 60 / 24) + 1

    query = "SELECT * FROM emails_sent_to_control_units ORDER BY email_address"
    initial_emails = read_query(db="monitorenv_remote", query=query)

    flow.schedule = None
    state = flow.run(
        test_mode=False,
        is_integration=True,
        start_days_ago=start_days_ago,
        end_days_ago=end_days_ago,
        email_all_units=email_all_units,
    )
    assert state.is_successful()

    final_emails = read_query(db="monitorenv_remote", query=query)
    assert len(initial_emails) == 0
    assert len(final_emails) == expected_number_of_sent_emails
