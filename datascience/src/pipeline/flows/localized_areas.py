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
def extract_localized_areas() -> gpd.GeoDataFrame:
    return extract(
        db_name="cacem_local",
        query_filepath="cross/cacem/localized_areas.sql",
        backend="geopandas",
        geom_col="geom",
        crs=4326,
    )

@task(checkpoint=False)
def load_localized_areas(localized_areas: gpd.GeoDataFrame):
    load(
        localized_areas,
        table_name="localized_areas",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        pg_array_columns=['control_unit_ids', 'amp_ids'],
        how="replace",
    )

with Flow("Localized Areas") as flow:
    localized_areas = extract_localized_areas()
    load_localized_areas(localized_areas)


flow.file_name = Path(__file__).name