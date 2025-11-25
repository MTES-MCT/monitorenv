import pandas as pd
from prefect import flow, get_run_logger, task

from src.generic_tasks import load
from src.shared_tasks.etl import extract_csv_file


@task
def load_control_objectives(control_objectives: pd.DataFrame):
    load(
        control_objectives,
        table_name="control_objectives",
        schema="public",
        db_name="monitorenv_remote",
        logger=get_run_logger(),
        how="replace",
    )


@flow(name="Control objectives")
def control_objectives_flow(file_name: str = "control_objectives.csv"):
    control_objectives = extract_csv_file(file_name=file_name)
    load_control_objectives(control_objectives)
