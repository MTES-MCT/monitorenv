import pandas as pd
import prefect
from prefect import flow, task

from src.generic_tasks import extract, load


@task
def extract_3_miles_areas() -> pd.DataFrame:
    return extract("monitorfish_local", "cross/cnsp/3_miles_areas.sql")


@task
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


@task
def extract_6_miles_areas() -> pd.DataFrame:
    return extract("monitorfish_local", "cross/cnsp/6_miles_areas.sql")


@task
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


@task
def extract_12_miles_areas() -> pd.DataFrame:
    return extract("monitorfish_local", "cross/cnsp/12_miles_areas.sql")


@task
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


@task
def extract_eez_areas() -> pd.DataFrame:
    return extract("monitorfish_local", "cross/cnsp/eez_areas.sql")


@task
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


@task
def extract_aem_areas() -> pd.DataFrame:
    return extract("monitorfish_local", "cross/cnsp/aem_areas.sql")


@task
def load_aem_areas(aem_areas: pd.DataFrame):
    load(
        aem_areas,
        table_name="aem_areas",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        how="replace",
    )


@task
def extract_departments_areas() -> pd.DataFrame:
    return extract("monitorfish_local", "cross/cnsp/departments_areas.sql")


@task
def load_departments_areas(departments_areas: pd.DataFrame):
    load(
        departments_areas,
        table_name="departments_areas",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        how="replace",
    )


@task
def extract_saltwater_limit_areas() -> pd.DataFrame:
    return extract("monitorfish_local", "cross/cnsp/saltwater_limit_areas.sql")


@task
def load_saltwater_limit_areas(saltwater_limit_areas: pd.DataFrame):
    load(
        saltwater_limit_areas,
        table_name="saltwater_limit_areas",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        how="replace",
    )


@task
def extract_transversal_sea_limit_areas() -> pd.DataFrame:
    return extract(
        "monitorfish_local", "cross/cnsp/transversal_sea_limit_areas.sql"
    )


@task
def load_transversal_sea_limit_areas(
    transversal_sea_limit_areas: pd.DataFrame,
):
    load(
        transversal_sea_limit_areas,
        table_name="transversal_sea_limit_areas",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        how="replace",
    )


@task
def extract_territorial_seas() -> pd.DataFrame:
    return extract("cacem_local", "cross/cacem/territorial_seas.sql")


@task
def load_territorial_seas(territorial_seas: pd.DataFrame):
    load(
        territorial_seas,
        table_name="territorial_seas",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        how="replace",
    )


@task
def extract_straight_baseline() -> pd.DataFrame:
    return extract("cacem_local", "cross/cacem/straight_baseline.sql")


@task
def load_straight_baseline(straight_baseline: pd.DataFrame):
    load(
        straight_baseline,
        table_name="straight_baseline",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        how="replace",
    )


@task
def extract_low_water_line() -> pd.DataFrame:
    return extract("cacem_local", "cross/cacem/low_water_line.sql")


@task
def load_low_water_line(low_water_line: pd.DataFrame):
    load(
        low_water_line,
        table_name="low_water_line",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        how="replace",
    )


@flow(name="Administrative areas")
def administrative_areas_flow():

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

    saltwater_limit_areas = extract_saltwater_limit_areas()
    load_saltwater_limit_areas(saltwater_limit_areas)

    transversal_sea_limit_areas = extract_transversal_sea_limit_areas()
    load_transversal_sea_limit_areas(transversal_sea_limit_areas)

    territorial_seas = extract_territorial_seas()
    load_territorial_seas(territorial_seas)

    straight_baseline = extract_straight_baseline()
    load_straight_baseline(straight_baseline)

    low_water_line = extract_low_water_line()
    load_low_water_line(low_water_line)
