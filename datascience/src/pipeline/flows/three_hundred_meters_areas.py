import geopandas as gpd
import prefect
from pathlib import Path
from prefect import Flow, task
from src.pipeline.generic_tasks import extract, load


@task(checkpoint=False)
def extract_three_hundred_meters_areas() -> gpd.GeoDataFrame:
    return extract(
        db_name="cacem_local",
        query_filepath="cross/cacem/three_hundred_meters_areas.sql",
        backend="geopandas",
        geom_col="geom",
        crs=4326,
    )


@task(checkpoint=False)
def load_three_hundred_meters_areas(three_hundred_meters_areas: gpd.GeoDataFrame):
    load(
        three_hundred_meters_areas,
        table_name="three_hundred_meters_areas",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        how="replace",
    )


with Flow("300 meters areas") as flow:
    three_hundred_meters_areas = extract_three_hundred_meters_areas()
    load_three_hundred_meters_areas(three_hundred_meters_areas)

flow.file_name = Path(__file__).name
