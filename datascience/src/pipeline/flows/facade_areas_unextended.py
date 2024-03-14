from pathlib import Path

import pandas as pd
import prefect
from prefect import Flow, task

from src.pipeline.generic_tasks import extract, load


@task(checkpoint=False)
def extract_facade_areas_unextended() -> pd.DataFrame:
    """
    Extract facade areas unextended from the monitorfish_local (cross) database as a DataFrame.

    Returns:
        pd.DataFrame: GeoDataFrame of facade areas
    """

    return extract(
        db_name="monitorfish_local", query_filepath="cross/cnsp/facade_areas_unextended.sql"
    )


@task(checkpoint=False)
def load_facade_areas_unextended(facade_areas_unextended: pd.DataFrame):

    logger = prefect.context.get("logger")

    load(
        facade_areas_unextended,
        table_name="facade_areas_unextended",
        schema="public",
        db_name="monitorenv_remote",
        logger=logger,
        how="replace",
    )


with Flow("Facade areas unextended") as flow:
    facade_areas_unextended = extract_facade_areas_unextended()
    load_facade_areas_unextended(facade_areas_unextended)

flow.file_name = Path(__file__).name
