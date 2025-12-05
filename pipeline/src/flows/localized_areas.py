import geopandas as gpd
from prefect import flow, get_run_logger, task

from src.generic_tasks import extract, load


@task
def extract_localized_areas() -> gpd.GeoDataFrame:
    return extract(
        db_name="cacem_local",
        query_filepath="cross/cacem/localized_areas.sql",
        backend="geopandas",
        geom_col="geom",
        crs=4326,
    )


@task
def load_localized_areas(localized_areas: gpd.GeoDataFrame):
    load(
        localized_areas,
        table_name="localized_areas",
        schema="public",
        db_name="monitorenv_remote",
        logger=get_run_logger(),
        pg_array_columns=["control_unit_ids", "amp_ids"],
        how="replace",
    )


@flow(name="Monitorenv - Localized Areas")
def localized_areas_flow():
    localized_areas = extract_localized_areas()
    load_localized_areas(localized_areas)
