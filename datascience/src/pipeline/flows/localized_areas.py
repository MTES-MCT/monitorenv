
from pathlib import Path
import geopandas as gpd
import prefect
from prefect import Flow, task

from src.pipeline.generic_tasks import extract, load

@task(checkpoint=False)
def extract_marine_cultures() -> gpd.GeoDataFrame:
    return extract(
        db_name="cacem_local",
        query_filepath="cross/cacem/marine_cultures.sql",
        backend="geopandas",
        geom_col="geom",
        crs=4326,
    )

@task(checkpoint=False)
def load_marine_cultures(marine_cultures: gpd.GeoDataFrame):
    load(
        marine_cultures,
        table_name="marpol",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        how="replace",
    )

with Flow("Marine Cultures") as flow:
      
      marine_cultures = extract_marine_cultures()
      load_marine_cultures(marine_cultures)

flow.file_name = Path(__file__).name