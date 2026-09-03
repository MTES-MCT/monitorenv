import pandas as pd
from prefect import flow, get_run_logger, task

from src.generic_tasks import extract, load


@task
def extract_species() -> pd.DataFrame:
    """
    Extract species from the monitorfish_local (cross) database as a DataFrame.

    Returns:
        pd.DataFrame: DataFrame of species
    """

    return extract(
        db_name="monitorfish_local",
        query_filepath="cross/cnsp/species.sql",
    )


@task
def load_species(facade_areas: pd.DataFrame):

    logger = get_run_logger()

    load(
        facade_areas,
        table_name="species",
        schema="public",
        db_name="monitorenv_remote",
        logger=logger,
        how="replace",
    )


@flow(name="Monitorenv - Species")
def species_flow():
    species = extract_species()
    load_species(species)
