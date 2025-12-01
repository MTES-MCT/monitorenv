import geopandas as gpd
from prefect import flow, get_run_logger, task

from src.generic_tasks import extract, load


@task
def extract_beaches() -> gpd.GeoDataFrame:
    return extract(
        db_name="cacem_local",
        query_filepath="cross/cacem/beaches.sql",
        backend="geopandas",
        geom_col="geom",
        crs=4326,
    )


@task
def load_beaches(beaches: gpd.GeoDataFrame):
    load(
        beaches,
        table_name="beaches",
        schema="public",
        db_name="monitorenv_remote",
        logger=get_run_logger(),
        how="replace",
    )


@flow(name="Beaches")
def beaches_flow():
    beaches = extract_beaches()
    load_beaches(beaches)
