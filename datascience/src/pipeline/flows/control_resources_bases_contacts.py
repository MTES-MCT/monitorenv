from pathlib import Path

import pandas as pd
import prefect
from prefect import Flow, Parameter, case, task
from prefect.executors import LocalDaskExecutor
from sqlalchemy import text

from src.db_config import create_engine
from src.pipeline.generic_tasks import load
from src.pipeline.shared_tasks.control_flow import check_flow_not_running
from src.pipeline.shared_tasks.etl import extract_csv_file


@task(checkpoint=False)
def load_control_unit_resources_and_bases(
    control_unit_resources: pd.DataFrame, bases: pd.DataFrame
):
    engine = create_engine("monitorenv_remote")
    with engine.begin() as con:

        # control_unit_resources must be emptied before reloading bases, due to the
        # foreign key constraint
        con.execute(text("DELETE FROM control_unit_resources;"))

        load(
            bases,
            table_name="bases",
            schema="public",
            connection=con,
            logger=prefect.context.get("logger"),
            how="replace",
        )
        con.execute(
            text("SELECT setval('bases_id_seq', (SELECT MAX(id) FROM bases))")
        )

        load(
            control_unit_resources,
            table_name="control_unit_resources",
            schema="public",
            connection=con,
            logger=prefect.context.get("logger"),
            how="replace",
        )

        con.execute(
            text(
                "SELECT setval('control_unit_resources_id_seq', "
                "(SELECT MAX(id) FROM control_unit_resources))"
            )
        )


@task(checkpoint=False)
def load_control_unit_contacts(control_unit_contacts: pd.DataFrame):
    engine = create_engine("monitorenv_remote")
    with engine.begin() as con:
        load(
            control_unit_contacts,
            table_name="control_unit_contacts",
            schema="public",
            connection=con,
            logger=prefect.context.get("logger"),
            how="replace",
        )
        con.execute(
            text(
                "SELECT setval('control_unit_contacts_id_seq', "
                "(SELECT MAX(id) FROM control_unit_contacts))"
            )
        )


with Flow(
    "Control resources, bases and contacts", executor=LocalDaskExecutor()
) as flow:

    control_unit_resources_file_name = Parameter(
        "control_unit_resources_file_name",
        default="control_unit_resources.csv",
    )
    control_unit_contacts_file_name = Parameter(
        "control_unit_contacts_file_name", default="control_unit_contacts.csv"
    )
    bases_file_name = Parameter("bases_file_name", default="bases.csv")

    flow_not_running = check_flow_not_running()
    with case(flow_not_running, True):
        control_unit_resources = extract_csv_file(
            control_unit_resources_file_name
        )
        control_unit_contacts = extract_csv_file(
            control_unit_contacts_file_name
        )
        bases = extract_csv_file(bases_file_name)

        load_control_unit_resources_and_bases(control_unit_resources, bases)
        load_control_unit_contacts(control_unit_contacts)

flow.file_name = Path(__file__).name
