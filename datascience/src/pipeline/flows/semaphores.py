from pathlib import Path

import pandas as pd
import prefect
from prefect import Flow, task

from src.pipeline.generic_tasks import extract, load


@task(checkpoint=False)
def extract_semaphores() -> pd.DataFrame:
    """
    Extract Semaphores from the cacem_local database as a DataFrame.

    Returns:
        pd.DataFrame: GeoDataFrame of Semaphores
    """

    return extract(db_name="cacem_local", query_filepath="cross/semaphore.sql")


@task(checkpoint=False)
def load_semaphores(semaphores: pd.DataFrame):

    logger = prefect.context.get("logger")

    load(
        semaphores,
        table_name="semaphores",
        schema="public",
        db_name="monitorenv_remote",
        logger=logger,
        how="replace",
    )


with Flow("Semaphores") as flow:
    semaphores = extract_semaphores()
    load_semaphores(semaphores)

flow.file_name = Path(__file__).name
