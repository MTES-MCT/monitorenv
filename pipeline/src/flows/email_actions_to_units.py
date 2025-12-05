from datetime import datetime, timedelta
from email.message import EmailMessage
from smtplib import (
    SMTPDataError,
    SMTPHeloError,
    SMTPNotSupportedError,
    SMTPRecipientsRefused,
    SMTPSenderRefused,
)
from time import sleep
from typing import List

import css_inline
import pandas as pd
from jinja2 import Environment, FileSystemLoader, Template, select_autoescape
from prefect import allow_failure, flow, get_run_logger, task, unmapped

from config import (
    CACEM_ANALYST_EMAIL,
    CACEM_ANALYST_NAME,
    CACEM_EMAIL_ADDRESS,
    EMAIL_STYLESHEETS_LOCATION,
    EMAIL_TEMPLATES_LOCATION,
    METABASE_URL,
)
from src.entities.actions_emailing import (
    ControlUnit,
    ControlUnitActions,
    ControlUnitActionsSentMessage,
    EnvActionType,
)
from src.generic_tasks import extract, load
from src.helpers.dates import Period
from src.helpers.emails import create_html_email, send_email
from src.shared_tasks.control_flow import filter_results, flatten
from src.shared_tasks.dates import get_utcnow


@task
def get_actions_period(
    utcnow: datetime,
    start_days_ago: int,
    end_days_ago: int,
) -> Period:

    assert isinstance(start_days_ago, int)
    assert isinstance(end_days_ago, int)
    assert start_days_ago > end_days_ago

    today = utcnow.date()

    start_day = today - timedelta(days=start_days_ago)
    end_day = today - timedelta(
        days=end_days_ago - 1
    )  # -1 to include the last day

    return Period(
        start=datetime(
            year=start_day.year, month=start_day.month, day=start_day.day
        ),
        end=datetime(year=end_day.year, month=end_day.month, day=end_day.day),
    )


@task
def extract_env_actions(period: Period) -> pd.DataFrame:
    return extract(
        "monitorenv_remote",
        "monitorenv/env_actions_to_email.sql",
        params={
            "min_datetime_utc": period.start,
            "max_datetime_utc": period.end,
        },
    )


@task
def get_control_unit_ids(env_action: pd.DataFrame) -> List[int]:
    # Warning : using `set` and not `.unique()` on `control_unit_id ` in order to
    # return `int` and not `numpy.int64` values, which are not handled by psycopg2 when
    # passed as query parameters.
    return sorted(set(env_action.control_unit_id))


@task
def extract_all_control_units() -> pd.DataFrame:
    return extract(
        "monitorenv_remote",
        "monitorenv/all_control_units.sql",
    )


@task
def extract_control_units(control_unit_ids: List[str]) -> pd.DataFrame:

    if len(control_unit_ids) == 0:
        raise ValueError("No control units to extract.")
    else:
        return extract(
            "monitorenv_remote",
            "monitorenv/control_units.sql",
            params={
                "control_unit_ids": tuple(control_unit_ids),
            },
        )


@task
def to_control_unit_actions(
    env_actions: pd.DataFrame,
    period: Period,
    control_units: pd.DataFrame,
) -> List[ControlUnitActions]:

    records = control_units.to_dict(orient="records")
    control_units = [ControlUnit(**control_unit) for control_unit in records]

    return [
        ControlUnitActions(
            control_unit=control_unit,
            period=period,
            controls=env_actions[
                (env_actions.action_type == EnvActionType.CONTROL.value)
                & (env_actions.control_unit_id == control_unit.control_unit_id)
                & (~env_actions.is_late_update)
            ].reset_index(drop=True),
            late_controls=env_actions[
                (env_actions.action_type == EnvActionType.CONTROL.value)
                & (env_actions.control_unit_id == control_unit.control_unit_id)
                & (env_actions.is_late_update)
            ].reset_index(drop=True),
            surveillances=env_actions[
                (env_actions.action_type == EnvActionType.SURVEILLANCE.value)
                & (env_actions.control_unit_id == control_unit.control_unit_id)
                & (~env_actions.is_late_update)
            ].reset_index(drop=True),
            late_surveillances=env_actions[
                (env_actions.action_type == EnvActionType.SURVEILLANCE.value)
                & (env_actions.control_unit_id == control_unit.control_unit_id)
                & (env_actions.is_late_update)
            ].reset_index(drop=True),
        )
        for control_unit in control_units
    ]


@task
def get_template() -> Template:
    templates_locations = [
        EMAIL_TEMPLATES_LOCATION,
        EMAIL_STYLESHEETS_LOCATION,
    ]

    env = Environment(
        loader=FileSystemLoader(templates_locations),
        autoescape=select_autoescape(),
    )

    return env.get_template("email_actions_to_units.jinja")


@task
def render(
    control_unit_actions: ControlUnitActions, template: Template
) -> str:
    def format_themes(themes: dict) -> str:

        formatted_themes = [
            f"{theme} ({', '.join(subthemes)})"
            for (theme, subthemes) in themes.items()
        ]

        return ", ".join(formatted_themes)

    def render_controls(controls: pd.DataFrame) -> str:
        controls = controls.copy(deep=True)

        controls["number_of_controls"] = controls.number_of_controls.fillna(
            0
        ).astype(int)
        controls["infraction"] = controls.infraction.map(
            {True: "Oui", False: "Non"}, na_action="ignore"
        ).fillna("-")
        controls[
            "action_start_datetime_utc"
        ] = controls.action_start_datetime_utc.map(
            lambda d: d.strftime("%Y-%m-%d %H:%M")
        )
        controls["mission_type"] = controls.mission_type.map(
            {"SEA": "Mer", "LAND": "Terre", "AIR": "Air"}
        )
        controls["themes"] = controls.themes.map(format_themes)

        columns = {
            "action_start_datetime_utc": "Date du contrôle",
            "mission_type": "Type de mission",
            "action_facade": "Façade",
            "action_department": "Département",
            "infraction": "Infraction relevée",
            "number_of_controls": "Nombre de contrôles",
            "themes": "Thématique(s) de contrôle",
        }

        controls = controls[columns.keys()].rename(columns=columns)
        controls = controls.to_html(index=False, border=1)
        return controls

    def render_surveillances(surveillances: pd.DataFrame) -> str:
        surveillances = surveillances.copy(deep=True)
        surveillances[
            "action_start_datetime_utc"
        ] = surveillances.action_start_datetime_utc.map(
            lambda d: d.strftime("%Y-%m-%d %H:%M")
        )
        surveillances[
            "action_end_datetime_utc"
        ] = surveillances.action_end_datetime_utc.map(
            lambda d: d.strftime("%Y-%m-%d %H:%M")
        )
        surveillances["mission_type"] = surveillances.mission_type.map(
            {"SEA": "Mer", "LAND": "Terre", "AIR": "Air"}
        )
        surveillances["themes"] = surveillances.themes.map(format_themes)

        columns = {
            "action_start_datetime_utc": "Début de surveillance",
            "action_end_datetime_utc": "Fin de surveillance",
            "mission_type": "Type de mission",
            "action_facade": "Façade",
            "action_department": "Département",
            "surveillance_duration": "Durée (h)",
            "themes": "Thématique(s) de surveillance",
        }

        surveillances = surveillances[columns.keys()].rename(columns=columns)
        surveillances = surveillances.to_html(index=False, border=1)
        return surveillances

    if len(control_unit_actions.controls) > 0:
        controls = render_controls(control_unit_actions.controls)
    else:
        controls = "Aucun"

    if len(control_unit_actions.surveillances) > 0:
        surveillances = render_surveillances(
            control_unit_actions.surveillances
        )
    else:
        surveillances = "Aucune"

    if len(control_unit_actions.late_controls) > 0:
        late_controls = render_controls(control_unit_actions.late_controls)
    else:
        late_controls = "Aucun"

    if len(control_unit_actions.late_surveillances) > 0:
        late_surveillances = render_surveillances(
            control_unit_actions.late_surveillances
        )
    else:
        late_surveillances = "Aucune"

    html = template.render(
        control_unit_name=control_unit_actions.control_unit.control_unit_name,
        controls=controls,
        late_controls=late_controls,
        surveillances=surveillances,
        late_surveillances=late_surveillances,
        from_date=control_unit_actions.period.start.strftime(
            "%d/%m/%Y %H:%M UTC"
        ),
        to_date=control_unit_actions.period.end.strftime("%d/%m/%Y %H:%M UTC"),
        metabase_url=METABASE_URL,
        cacem_email_address=CACEM_EMAIL_ADDRESS,
        cacem_analyst_name=CACEM_ANALYST_NAME,
        cacem_analyst_email=CACEM_ANALYST_EMAIL,
    )

    html = css_inline.inline(html)
    return html


@task
def create_email(
    html: str, actions: ControlUnitActions, test_mode: bool
) -> EmailMessage:

    to = (
        CACEM_EMAIL_ADDRESS
        if test_mode
        else actions.control_unit.email_addresses
    )

    message = create_html_email(
        to=to,
        subject="Bilan hebdomadaire contrôle de l'environnement marin",
        html=html,
        reply_to=CACEM_EMAIL_ADDRESS,
    )

    return message


@task
def send_env_actions_email(
    message: EmailMessage, actions: ControlUnitActions, is_integration: bool
) -> List[ControlUnitActionsSentMessage]:
    """
    Sends input email using the contents of `From` header as sender and `To`, `Cc`
    and `Bcc` headers as recipients.

    Args:
        message (EmailMessage): email message to send
        actions (ControlUnitActions): `ControlUnitActions` related to message
        is_integration (bool): if ``False``, the message is not actually sent

    Returns:
        List[ControlUnitActionsSentMessage]: List of sent messages and their error
        codes, if any.
    """

    logger = get_run_logger()
    addressees = actions.control_unit.email_addresses

    try:
        try:
            if is_integration:
                logger.info(("(Mock) Sending env actions."))
                send_errors = {}
            else:
                logger.info(("Sending env actions."))
                send_errors = send_email(message)
        except (SMTPHeloError, SMTPDataError):
            # Retry
            logger.warning("Message not sent, retrying...")
            sleep(10)
            send_errors = send_email(message)
    except SMTPHeloError:
        send_errors = {
            addr: (
                None,
                "The server didn't reply properly to the helo greeting.",
            )
            for addr in addressees
        }
        logger.error(str(send_errors))
    except SMTPRecipientsRefused:
        # All recipients were refused
        send_errors = {
            addr: (
                None,
                "The server rejected ALL recipients (no mail was sent)",
            )
            for addr in addressees
        }
        logger.error(str(send_errors))
    except SMTPSenderRefused:
        send_errors = {
            addr: (
                None,
                "The server didn't accept the from_addr.",
            )
            for addr in addressees
        }
        logger.error(str(send_errors))
    except SMTPDataError:
        send_errors = {
            addr: (
                None,
                (
                    "The server replied with an unexpected error code "
                    "(other than a refusal of a recipient)."
                ),
            )
            for addr in addressees
        }
        logger.error(str(send_errors))
    except SMTPNotSupportedError:
        send_errors = {
            addr: (
                None,
                (
                    "The mail_options parameter includes 'SMTPUTF8' but the SMTPUTF8 "
                    "extension is not supported by the server."
                ),
            )
            for addr in addressees
        }
        logger.error(str(send_errors))
    except ValueError:
        send_errors = {
            addr: (
                None,
                "there is more than one set of 'Resent-' headers.",
            )
            for addr in addressees
        }
        logger.error(str(send_errors))
    except Exception:
        send_errors = {addr: (None, "Unknown error.") for addr in addressees}
        logger.error(str(send_errors))

    now = datetime.utcnow()

    sent_messages = []

    for addressee in addressees:
        if addressee in send_errors:
            success = False
            error_code = send_errors[addressee][0]
            error_message = send_errors[addressee][1]
        else:
            success = True
            error_code = None
            error_message = None

        sent_messages.append(
            ControlUnitActionsSentMessage(
                control_unit_id=actions.control_unit.control_unit_id,
                control_unit_name=actions.control_unit.control_unit_name,
                email_address=addressee,
                sending_datetime_utc=now,
                actions_min_datetime_utc=actions.period.start,
                actions_max_datetime_utc=actions.period.end,
                number_of_actions=len(actions.controls)
                + len(actions.surveillances)
                + len(actions.late_controls)
                + len(actions.late_surveillances),
                success=success,
                error_code=error_code,
                error_message=error_message,
            )
        )
    return sent_messages


@task
def control_unit_actions_list_to_df(
    messages: List[ControlUnitActionsSentMessage],
) -> pd.DataFrame:
    messages = pd.DataFrame(messages)
    return messages


@task
def load_emails_sent_to_control_units(
    emails_sent_to_control_units: pd.DataFrame,
):
    load(
        emails_sent_to_control_units,
        table_name="emails_sent_to_control_units",
        schema="public",
        db_name="monitorenv_remote",
        how="replace",
        nullable_integer_columns=["error_code"],
        logger=get_run_logger(),
    )


@flow(name="Monitorenv - Email actions to units")
def email_actions_to_units_flow(
    test_mode: bool,
    is_integration: bool,
    start_days_ago: int,
    end_days_ago: int,
    email_all_units: bool,
):
    template = get_template()
    utcnow = get_utcnow()

    period = get_actions_period(
        utcnow=utcnow,
        start_days_ago=start_days_ago,
        end_days_ago=end_days_ago,
    )
    env_actions = extract_env_actions(period=period)

    if email_all_units is True:
        control_units = extract_all_control_units()

    else:
        control_unit_ids = get_control_unit_ids(env_actions)
        control_units = extract_control_units(control_unit_ids)

    control_unit_actions = to_control_unit_actions(
        env_actions, period, control_units
    )

    html = render.map(control_unit_actions, template=unmapped(template))

    message = create_email.map(
        html=html,
        actions=control_unit_actions,
        test_mode=unmapped(test_mode),
    )
    message = filter_results(allow_failure(message))

    sent_messages = flatten(
        send_env_actions_email.map(
            message,
            control_unit_actions,
            is_integration=unmapped(is_integration),
        )
    )

    sent_messages = filter_results(allow_failure(sent_messages))
    sent_messages = control_unit_actions_list_to_df(sent_messages)
    load_emails_sent_to_control_units(sent_messages)
