import pandas as pd
from prefect import flow, get_run_logger, task

from src.generic_tasks import extract, load


@task
def extract_facade_areas_unextended() -> pd.DataFrame:
    """
    Extract facade areas unextended from the monitorfish_local (cross) database as a DataFrame.

    Returns:
        pd.DataFrame: GeoDataFrame of facade areas
    """

    return extract(
        db_name="monitorfish_local",
        query_filepath="cross/cnsp/facade_areas_unextended.sql",
    )


@task
def load_facade_areas_unextended(facade_areas_unextended: pd.DataFrame):

    logger = get_run_logger()

    load(
        facade_areas_unextended,
        table_name="facade_areas_unextended",
        schema="public",
        db_name="monitorenv_remote",
        logger=logger,
        how="replace",
    )


@flow(name="Monitorenv - Facade areas unextended")
def facade_areas_unextended_flow():
    facade_areas_unextended = extract_facade_areas_unextended()
    load_facade_areas_unextended(facade_areas_unextended)
