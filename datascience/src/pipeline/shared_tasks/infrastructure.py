import prefect
from prefect import task
from sqlalchemy import Table

from src.db_config import create_engine
from src.pipeline import utils


@task(checkpoint=False)
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

    logger = prefect.context.get("logger")

    return utils.get_table(
        table_name,
        schema=schema,
        conn=create_engine(database),
        logger=logger,
    )
