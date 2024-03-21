from datetime import datetime, timedelta
from email.message import EmailMessage
from io import BytesIO
from pathlib import Path
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
import prefect
from jinja2 import Environment, FileSystemLoader, Template, select_autoescape
from prefect import Flow, Parameter, case, flatten, task, unmapped
from prefect.executors import LocalDaskExecutor

from config import (
    CACEM_EMAIL_ADDRESS,
    EMAIL_STYLESHEETS_LOCATION,
    EMAIL_TEMPLATES_LOCATION,
)
from src.pipeline.entities.actions_emailing import (
    ControlUnit,
    ControlUnitActions,
    ControlUnitActionsSentMessage,
)
from src.pipeline.generic_tasks import extract, load
from src.pipeline.helpers.dates import Period
from src.pipeline.helpers.emails import create_html_email, send_email
from src.pipeline.shared_tasks.control_flow import (
    check_flow_not_running,
    filter_results,
)
from src.pipeline.shared_tasks.dates import get_utcnow


@task(checkpoint=False)
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


@task(checkpoint=False)
def extract_env_actions(period: Period):
    return extract(
        "monitorenv_remote",
        "monitorenv/env_actions_to_email.sql",
        params={
            "min_datetime_utc": period.start,
            "max_datetime_utc": period.end,
        },
    )


@task(checkpoint=False)
def get_control_unit_ids(env_action: pd.DataFrame) -> List[int]:
    # Warning : using `set` and not `.unique()` on `control_unit_id ` in order to return
    # `int` and not `numpy.int64` values, which are not handled by psycopg2 when passed
    # as query parameters.
    return sorted(set(env_action.control_unit_id))


@task(checkpoint=False)
def extract_control_units(
    control_unit_ids: List[str], contact_names: List[str]
) -> pd.DataFrame:
    return extract(
        "monitorenv_remote",
        "monitorenv/control_units.sql",
        params={
            "control_unit_ids": tuple(control_unit_ids),
            "contact_names": tuple(contact_names),
        },
    )


@task(checkpoint=False)
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
            env_actions=env_actions[
                env_actions.control_unit_id == control_unit.control_unit_id
            ].reset_index(drop=True),
        )
        for control_unit in control_units
    ]


@task(checkpoint=False)
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


@task(checkpoint=False)
def render(actions: ControlUnitActions, template: Template) -> str:

    html = template.render(
        control_unit_name=actions.control_unit.control_unit_name,
        from_date=actions.period.start.strftime("%d/%m/%Y %H:%M UTC"),
        to_date=actions.period.end.strftime("%d/%m/%Y %H:%M UTC"),
    )

    html = css_inline.inline(html)
    return html


@task(checkpoint=False)
def create_email(
    html: str, actions: ControlUnitActions, test_mode: bool
) -> EmailMessage:

    buf = BytesIO()
    actions.env_actions.to_csv(buf, mode="wb", index=False)
    buf.seek(0)

    to = (
        CACEM_EMAIL_ADDRESS
        if test_mode
        else actions.control_unit.email_addresses
    )

    message = create_html_email(
        to=to,
        subject="Bilan hebdomadaire contrôle de l'environnement marin",
        html=html,
        attachments={"env_actions.csv": buf.read()},
        reply_to=CACEM_EMAIL_ADDRESS,
    )

    return message


@task(checkpoint=False)
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

    logger = prefect.context.get("logger")
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
                number_of_actions=len(actions.env_actions),
                success=success,
                error_code=error_code,
                error_message=error_message,
            )
        )
    return sent_messages


@task(checkpoint=False)
def control_unit_actions_list_to_df(
    messages: List[ControlUnitActionsSentMessage],
) -> pd.DataFrame:
    messages = pd.DataFrame(messages)
    return messages


@task(checkpoint=False)
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
        logger=prefect.context.get("logger"),
    )


with Flow("Email actions to units", executor=LocalDaskExecutor()) as flow:
    flow_not_running = check_flow_not_running()
    with case(flow_not_running, True):
        test_mode = Parameter("test_mode")
        is_integration = Parameter("is_integration")
        start_days_ago = Parameter("start_days_ago")
        end_days_ago = Parameter("end_days_ago")
        contact_names = Parameter("contact_names")

        template = get_template()
        utcnow = get_utcnow()

        period = get_actions_period(
            utcnow=utcnow,
            start_days_ago=start_days_ago,
            end_days_ago=end_days_ago,
        )
        env_actions = extract_env_actions(period=period)
        control_unit_ids = get_control_unit_ids(env_actions)
        control_units = extract_control_units(control_unit_ids, contact_names)

        control_unit_actions = to_control_unit_actions(
            env_actions, period, control_units
        )

        html = render.map(control_unit_actions, template=unmapped(template))

        message = create_email.map(
            html=html,
            actions=control_unit_actions,
            test_mode=unmapped(test_mode),
        )
        message = filter_results(message)

        sent_messages = send_env_actions_email.map(
            message,
            control_unit_actions,
            is_integration=unmapped(is_integration),
        )

        sent_messages = flatten(sent_messages)
        sent_messages = control_unit_actions_list_to_df(sent_messages)
        load_emails_sent_to_control_units(sent_messages)

flow.file_name = Path(__file__).name
