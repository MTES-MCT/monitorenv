from pathlib import Path

from prefect import Flow, case
from prefect.executors import LocalDaskExecutor

from config import QUERIES_LOCATION
from src.pipeline.shared_tasks.control_flow import check_flow_not_running
from src.pipeline.shared_tasks.etl import run_sql_script

with Flow(
    "Update departments and façades", executor=LocalDaskExecutor()
) as flow:

    flow_not_running = check_flow_not_running()
    with case(flow_not_running, True):

        run_sql_script(
            QUERIES_LOCATION / "monitorenv/update_missions_facades.sql"
        )
        run_sql_script(
            QUERIES_LOCATION / "monitorenv/update_actions_departments.sql"
        )
        run_sql_script(
            QUERIES_LOCATION / "monitorenv/update_actions_facades.sql"
        )

flow.file_name = Path(__file__).name
