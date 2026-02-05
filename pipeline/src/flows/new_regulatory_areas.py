import pandas as pd
from prefect import flow, get_run_logger, task
from sqlalchemy import text

from src.db_config import create_engine
from src.generic_tasks import delete_rows, extract, load

@task
def extract_new_regulatory_areas() -> pd.DataFrame:
    return extract(
        "cacem_local",
        "cross/cacem/new_regulatory_areas.sql",
                backend="geopandas",
        geom_col="geom",
        crs=4326,
    )


@task
def load_new_regulatory_areas(new_regulatory_areas: pd.DataFrame):
    """Load the output of ``extract_new_regulatory_areas`` task into ``regulatory_areas``
    table.

    Args:
        new_regulatory_areas (pd.DataFrame): output of ``extract_new_regulatory_areas`` task.
    """

    load(
        new_regulatory_areas,
        table_name="regulatory_areas",
        schema="public",
        db_name="monitorenv_remote",
        logger=get_run_logger(),
        how="append",
    )


@flow(name="Monitorenv - New Regulatory Areas")
def new_regulatory_areas_flow():
    new_regulations = extract_new_regulatory_areas()
    load_new_regulatory_areas(new_regulations)

