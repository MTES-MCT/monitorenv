from pathlib import Path

import pandas as pd
import prefect
from prefect import Flow, Parameter, case, task
from prefect.executors import LocalDaskExecutor

from config import LIBRARY_LOCATION
from src.pipeline.generic_tasks import load
from src.pipeline.shared_tasks.control_flow import check_flow_not_running


@task(checkpoint=False)
def extract_control_objectives(file_name: str) -> pd.DataFrame:
    return pd.read_csv(LIBRARY_LOCATION / f"pipeline/data/{file_name}")


@task(checkpoint=False)
def load_control_objectives(control_objectives: pd.DataFrame):
    load(
        control_objectives,
        table_name="control_objectives",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        how="replace",
    )


with Flow("Control objectives", executor=LocalDaskExecutor()) as flow:

    file_name = Parameter("file_name", default="control_objectives.csv")

    flow_not_running = check_flow_not_running()
    with case(flow_not_running, True):
        control_objectives = extract_control_objectives(file_name=file_name)
        load_control_objectives(control_objectives)

flow.file_name = Path(__file__).name
