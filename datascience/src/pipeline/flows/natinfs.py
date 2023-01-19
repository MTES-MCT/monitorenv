from pathlib import Path

import prefect
from prefect import Flow, case, task
from prefect.executors import LocalDaskExecutor

from src.pipeline.generic_tasks import extract, load
from src.pipeline.shared_tasks.control_flow import check_flow_not_running


@task(checkpoint=False)
def extract_natinfs():
    return extract("fmc", "fmc/natinf.sql")


@task(checkpoint=False)
def clean_natinfs(natinfs):
    natinfs.loc[:, "infraction"] = natinfs.infraction.map(str.capitalize)
    return natinfs


@task(checkpoint=False)
def load_natinfs(natinfs):
    load(
        natinfs,
        table_name="natinfs",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        how="replace",
    )


with Flow("Natinfs", executor=LocalDaskExecutor()) as flow:

    flow_not_running = check_flow_not_running()
    with case(flow_not_running, True):

        natinfs = extract_natinfs()
        natinfs = clean_natinfs(natinfs)
        load_natinfs(natinfs)

flow.file_name = Path(__file__).name
