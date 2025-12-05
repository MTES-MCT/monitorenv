import geopandas as gpd
from prefect import flow, get_run_logger, task

from src.generic_tasks import extract, load


@task
def extract_marpol() -> gpd.GeoDataFrame:
    return extract(
        db_name="cacem_local",
        query_filepath="cross/cacem/marpol.sql",
        backend="geopandas",
        geom_col="geom",
        crs=4326,
    )


@task
def load_marpol(marpol: gpd.GeoDataFrame):
    load(
        marpol,
        table_name="marpol",
        schema="public",
        db_name="monitorenv_remote",
        logger=get_run_logger(),
        how="replace",
    )


@flow(name="Monitorenv - Marpol")
def marpol_flow():
    marpol = extract_marpol()
    load_marpol(marpol)
