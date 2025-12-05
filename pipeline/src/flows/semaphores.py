import pandas as pd
from prefect import flow, get_run_logger, task
from sqlalchemy import DDL

from src.generic_tasks import extract, load


@task
def extract_semaphores() -> pd.DataFrame:
    """
    Extract Semaphores from the cacem_local database as a DataFrame.

    Returns:
        pd.DataFrame: GeoDataFrame of Semaphores
    """

    return extract(
        db_name="cacem_local", query_filepath="cross/cacem/semaphore.sql"
    )


@task
def load_semaphores(semaphores: pd.DataFrame):

    logger = get_run_logger()

    load(
        semaphores,
        table_name="semaphores",
        schema="public",
        db_name="monitorenv_remote",
        logger=logger,
        how="upsert",
        df_id_column="id",
        table_id_column="id",
        init_ddls=[
            DDL(
                "ALTER TABLE public.reportings_source "
                "DROP CONSTRAINT fk_semaphores;"
            )
        ],
        end_ddls=[
            DDL(
                "ALTER TABLE public.reportings_source "
                "ADD CONSTRAINT fk_semaphores "
                "FOREIGN KEY (semaphore_id) REFERENCES public.semaphores (id);"
            )
        ],
    )


@flow(name="Monitorenv - Semaphores")
def semaphores_flow():
    semaphores = extract_semaphores()
    load_semaphores(semaphores)
