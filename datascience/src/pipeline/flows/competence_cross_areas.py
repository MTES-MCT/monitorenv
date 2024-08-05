
from pathlib import Path
import geopandas as gpd
import prefect
from prefect import Flow, task

from src.pipeline.generic_tasks import extract, load

@task(checkpoint=False)
def extract_marpol() -> gpd.GeoDataFrame:
    return extract(
        db_name="cacem_local",
        query_filepath="cross/cacem/marpol.sql",
        backend="geopandas",
        geom_col="geom",
        crs=4326,
    )

@task(checkpoint=False)
def load_marpol(marpol: gpd.GeoDataFrame):
    load(
        marpol,
        table_name="marpol",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        how="replace",
    )

with Flow("Marpol") as flow:
      
      marpol = extract_marpol()
      load_marpol(marpol)

flow.file_name = Path(__file__).name