from prefect import flow

from config import QUERIES_LOCATION
from src.shared_tasks.etl import run_sql_script


@flow(name="Remove broken missions resources links")
def remove_broken_missions_resources_links_flow():
    run_sql_script(
        QUERIES_LOCATION
        / "monitorenv/remove_broken_missions_resources_links.sql"
    )
