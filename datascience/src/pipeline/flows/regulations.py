from pathlib import Path

import pandas as pd
import prefect
from prefect import Flow, case, task

from src.pipeline.generic_tasks import extract, load



@task(checkpoint=False)
def extract_regulations() -> pd.DataFrame:
    """
    Extract regulations cacem

    Returns:
        pd.DataFrame: GeoDataFrame of regulation 
    """
    return extract(
        db_name="monitorfish_local",
        query_filepath="cross/regulations.sql"
    )


@task(checkpoint=False)
def load_regulations(new_regulations: pd.DataFrame):
    """Load the output of ``extract_regulations`` task into ``regulations``
    table.

    Args:
        new_regulations (pd.DataFrame): output of ``extract_regulations`` task.
    """

    logger = prefect.context.get("logger")

    load(
        new_regulations,
        table_name="regulations_cacem",
        schema="public",
        db_name="monitorenv_remote",
        logger=logger,
        how="replace",
    )


with Flow("Regulations") as flow:

    regulations = extract_regulations()
    load_regulations(regulations)

flow.file_name = Path(__file__).name
