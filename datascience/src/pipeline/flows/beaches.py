from pathlib import Path
import prefect
import geopandas as gpd
from prefect import Flow, task
from src.pipeline.generic_tasks import extract, load


@task(checkpoint=False)
def extract_beaches() -> gpd.GeoDataFrame:
    return extract(
        db_name="cacem_local",
        query_filepath="cross/cacem/beaches.sql",
        backend="geopandas",
        geom_col="geom",
        crs=4326,
    )

@task(checkpoint=False)
def load_beaches(beaches: gpd.GeoDataFrame):
    load(
        beaches,
        table_name="beaches",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        how="replace",
    )

with Flow("Beaches") as flow:
    beaches = extract_beaches()
    load_beaches(beaches)


flow.file_name = Path(__file__).name