from pathlib import Path

import pandas as pd
import prefect
from prefect import Flow, Parameter, case, task
from prefect.executors import LocalDaskExecutor
from sqlalchemy import text

from datascience.src.pipeline.utils import psql_insert_copy
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


@task(checkpoint=False)
def load_control_unit_notes(
    area_notes: pd.DataFrame, terms_notes: pd.DataFrame
):
    engine = create_engine("monitorenv_remote")
    logger = prefect.context.get("logger")

    with engine.begin() as con:
        logger.info("Creating tmp_area_notes temporary table")
        con.execute(
            text(
                "CREATE TEMP TABLE tmp_area_notes("
                "    control_unit_id INTEGER PRIMARY KEY,"
                "    area_note VARCHAR NOT NULL"
                ")"
                "ON COMMIT DROP;"
            )
        )

        logger.info("Loading area notes to temporary table")

        area_notes.to_sql(
            "tmp_area_notes",
            con,
            if_exists="append",
            index=False,
            method=psql_insert_copy,
        )

        logger.info("Updating area notes from temporary table")

        con.execute(
            text(
                "UPDATE public.control_units cu "
                "SET area_note = an.area_note "
                "FROM tmp_area_notes an "
                "WHERE cu.id = an.control_unit_id;"
            )
        )

        logger.info("Creating tmp_terms_notes temporary table")
        con.execute(
            text(
                "CREATE TEMP TABLE tmp_terms_notes("
                "    control_unit_id INTEGER PRIMARY KEY,"
                "    terms_note VARCHAR NOT NULL"
                ")"
                "ON COMMIT DROP;"
            )
        )

        logger.info("Loading terms notes to temporary table")

        terms_notes.to_sql(
            "tmp_terms_notes",
            con,
            if_exists="append",
            index=False,
            method=psql_insert_copy,
        )

        logger.info("Updating terms notes from temporary table")

        con.execute(
            text(
                "UPDATE public.control_units cu "
                "SET terms_note = tn.terms_note "
                "FROM tmp_terms_notes tn "
                "WHERE cu.id = tn.control_unit_id;"
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
    area_notes_file_name = Parameter(
        "area_notes_file_name", default="area_notes.csv"
    )
    terms_notes_file_name = Parameter(
        "terms_notes_file_name", default="terms_notes.csv"
    )

    flow_not_running = check_flow_not_running()
    with case(flow_not_running, True):
        control_unit_resources = extract_csv_file(
            control_unit_resources_file_name
        )
        control_unit_contacts = extract_csv_file(
            control_unit_contacts_file_name
        )
        bases = extract_csv_file(bases_file_name)
        area_notes = extract_csv_file(area_notes_file_name)
        terms_notes = extract_csv_file(terms_notes_file_name)

        load_control_unit_resources_and_bases(control_unit_resources, bases)
        load_control_unit_contacts(control_unit_contacts)
        load_control_unit_notes(area_notes, terms_notes)

flow.file_name = Path(__file__).name
