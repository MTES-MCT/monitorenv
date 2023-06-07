from pathlib import Path

import pandas as pd
import prefect
from prefect import task
from sqlalchemy import text

from src.db_config import create_engine


@task(checkpoint=False)
def run_sql_script(sql_filepath: Path) -> pd.DataFrame:

    logger = prefect.context.get("logger")
    with open(sql_filepath, "r") as sql_file:
        query = text(sql_file.read())

    e = create_engine("monitorenv_remote")

    logger.info(f"Executing {sql_filepath}.")
    with e.begin() as con:
        con.execute(query)
