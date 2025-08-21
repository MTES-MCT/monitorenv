from pathlib import Path
import pandas as pd
import prefect
import geopandas as gpd
from prefect import Flow, case, task
from src.pipeline.generic_tasks import delete_rows, extract, load
from src.pipeline.processing import df_values_to_psql_arrays
from sqlalchemy import text
from src.db_config import create_engine
from src.pipeline.utils import psql_insert_copy


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