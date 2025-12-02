from prefect import get_run_logger, task
from sqlalchemy import Table

from src import utils
from src.db_config import create_engine


@task
def get_table(
    table_name: str,
    schema: str = "public",
    database: str = "monitorenv_remote",
) -> Table:
    """
    Returns a `Table` representing the specified table.

    Args:
        table_name (str): Name of the table
        schema (str, optional): Schema of the table. Defaults to "public".
        database (str, optional): Database of the table, can be 'monitorenv_remote'
          or 'monitorfish_local'. Defaults to "monitorenv_remote".

    Returns:
        Table: `sqlalchemy.Table` representing the specified table.
    """

    logger = get_run_logger()

    return utils.get_table(
        table_name,
        schema=schema,
        conn=create_engine(database),
        logger=logger,
    )
