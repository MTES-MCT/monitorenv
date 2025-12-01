from pathlib import Path

import pandas as pd
from prefect import get_run_logger, task
from sqlalchemy import text

from config import LIBRARY_LOCATION
from src.db_config import create_engine


@task
def run_sql_script(sql_filepath: Path) -> pd.DataFrame:

    logger = get_run_logger()
    with open(sql_filepath, "r") as sql_file:
        query = text(sql_file.read())

    e = create_engine("monitorenv_remote")

    logger.info(f"Executing {sql_filepath}.")
    with e.begin() as con:
        con.execute(query)


@task
def extract_csv_file(file_name: str) -> pd.DataFrame:
    """
    Returns a CSV file's content as DataFrame.
    The designated file must be in the folder data.

    Args:
        file_name (str): Name of the file

    Returns:
        pd.DataFrame: CSV file content
    """
    return pd.read_csv(LIBRARY_LOCATION / f"data/{file_name}")
