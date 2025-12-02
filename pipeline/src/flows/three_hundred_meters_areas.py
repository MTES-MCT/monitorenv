import geopandas as gpd
from prefect import flow, get_run_logger, task

from src.generic_tasks import extract, load


@task
def extract_three_hundred_meters_areas() -> gpd.GeoDataFrame:
    return extract(
        db_name="cacem_local",
        query_filepath="cross/cacem/three_hundred_meters_areas.sql",
        backend="geopandas",
        geom_col="geom",
        crs=4326,
    )


@task
def load_three_hundred_meters_areas(
    three_hundred_meters_areas: gpd.GeoDataFrame,
):
    load(
        three_hundred_meters_areas,
        table_name="three_hundred_meters_areas",
        schema="public",
        db_name="monitorenv_remote",
        logger=get_run_logger(),
        how="replace",
    )


@flow(name="300 meters areas")
def three_hunder_meters_areas_flow():
    three_hundred_meters_areas = extract_three_hundred_meters_areas()
    load_three_hundred_meters_areas(three_hundred_meters_areas)
