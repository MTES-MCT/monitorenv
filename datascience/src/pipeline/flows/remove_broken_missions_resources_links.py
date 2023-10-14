from pathlib import Path

from prefect import Flow

from config import QUERIES_LOCATION
from src.pipeline.shared_tasks.etl import run_sql_script

with Flow("Remove broken missions resources links") as flow:
    run_sql_script(
        QUERIES_LOCATION
        / "monitorenv/remove_broken_missions_resources_links.sql"
    )

flow.file_name = Path(__file__).name
