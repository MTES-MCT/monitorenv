from pathlib import Path

import pandas as pd
import prefect
from prefect import Flow, task

from src.pipeline.generic_tasks import extract, load


@task(checkpoint=False)
def extract_3_miles_areas() -> pd.DataFrame:
    return extract("monitorfish_local", "cross/3_miles_areas.sql")


@task(checkpoint=False)
def load_3_miles_areas(
    three_miles_areas: pd.DataFrame,
):
    load(
        three_miles_areas,
        table_name="3_miles_areas",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        how="replace",
    )


@task(checkpoint=False)
def extract_6_miles_areas() -> pd.DataFrame:
    return extract("monitorfish_local", "cross/6_miles_areas.sql")


@task(checkpoint=False)
def load_6_miles_areas(
    six_miles_areas: pd.DataFrame,
):
    load(
        six_miles_areas,
        table_name="6_miles_areas",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        how="replace",
    )


@task(checkpoint=False)
def extract_12_miles_areas() -> pd.DataFrame:
    return extract("monitorfish_local", "cross/12_miles_areas.sql")


@task(checkpoint=False)
def load_12_miles_areas(
    twelve_miles_areas: pd.DataFrame,
):
    load(
        twelve_miles_areas,
        table_name="12_miles_areas",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        how="replace",
    )


@task(checkpoint=False)
def extract_eez_areas() -> pd.DataFrame:
    return extract("monitorfish_local", "cross/eez_areas.sql")


@task(checkpoint=False)
def load_eez_areas(
    eez_areas: pd.DataFrame,
):
    load(
        eez_areas,
        table_name="eez_areas",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        how="replace",
    )


@task(checkpoint=False)
def extract_aem_areas() -> pd.DataFrame:
    return extract("monitorfish_local", "cross/aem_areas.sql")


@task(checkpoint=False)
def load_aem_areas(aem_areas: pd.DataFrame):
    load(
        aem_areas,
        table_name="aem_areas",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        how="replace",
    )


@task(checkpoint=False)
def extract_departments_areas() -> pd.DataFrame:
    return extract("monitorfish_local", "cross/departments_areas.sql")


@task(checkpoint=False)
def load_departments_areas(departments_areas: pd.DataFrame):
    load(
        departments_areas,
        table_name="departments_areas",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        how="replace",
    )


with Flow("Administrative areas") as flow:

    three_miles_areas = extract_3_miles_areas()
    load_3_miles_areas(three_miles_areas)

    six_miles_areas = extract_6_miles_areas()
    load_6_miles_areas(six_miles_areas)

    twelve_miles_areas = extract_12_miles_areas()
    load_12_miles_areas(twelve_miles_areas)

    eez_areas = extract_eez_areas()
    load_eez_areas(eez_areas)

    aem_areas = extract_aem_areas()
    load_aem_areas(aem_areas)

    departments_areas = extract_departments_areas()
    load_departments_areas(departments_areas)

flow.file_name = Path(__file__).name
