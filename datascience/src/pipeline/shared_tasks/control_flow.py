from pathlib import Path
from typing import List

import prefect
from prefect import task
from prefect.engine.signals import SKIP
from prefect.utilities.graphql import with_args


@task(checkpoint=False)
def check_flow_not_running() -> bool:
    """
    This task determines if the flow in which it runs has flow runs in a 'running'
    state. This may be used to stop a flow run from proceeding if the flow's previous
    run has not yet finished running and concurrency is not desired.

    Returns:
        bool: ``True`` if the flow does NOT already have flow runs in a "running"
          state, ``False`` if it does
    """

    prefect_client = prefect.Client()

    query = {
        "query": {
            with_args(
                "flow_run",
                {
                    "where": {
                        "flow_id": {"_eq": prefect.context.flow_id},
                        "id": {"_neq": prefect.context.flow_run_id},
                        "state": {"_eq": "Running"},
                    }
                },
            ): {"id"}
        }
    }
    response = prefect_client.graphql(query)
    active_flow_runs = response.get("data", {}).get("flow_run", [])

    flow_is_not_running = active_flow_runs == []

    if not flow_is_not_running:
        logger = prefect.context.get("logger")
        logger.info("This flow already has runs in a 'Running' state.")

    return flow_is_not_running


@task(checkpoint=False)
def str_to_path(path: str) -> Path:
    """Returns `Path` object corresponding to input `str`

    Args:
        path (str): 'stairway/to/heaven'

    Returns:
        Path: Path('stairway/to/heaven')
    """
    return Path(path)


@task(
    checkpoint=False,
    skip_on_upstream_skip=False,
    trigger=prefect.triggers.all_finished,
)
def filter_results(task_results) -> List:
    """
    Filters invalid results from an input mapped results list.

    Warning: It is mandatory to use `skip_on_upstream_skip = False`, otherwise the whole
    task is skipped if any of the results of the upstream mapped task raises a SKIP
    signal, which defeats the purpose of this task which is to discard the invalid
    results produced by the upstream tasks and keep the valid ones and pass them on
    downstream.

    As a consequence,

        !!!! THIS TASK WILL RUN EVEN IF THE UPSTREAM TASKS ARE SKIPPED !!!!

    This can have weird consequences, as the task can run successfully, and pass on
    successful results to downstream tasks which were also supposed to be skipped.

    This happens including in a `case` branch of a flow that should be skipped.

    In order to try to circumvent this issue, we raise a `SKIP` signal if the input is
    `None`, which is what happens if the input is provided by an upsteam task that is
    itself skipped. This does not cover all cases at all, in particular, in situations
    where tasks may be skipped (in case branch mostly) make sure not to use this task
    with input data coming from upstream tasks that may not be skipped.

    Args:
        task_results: List of (mapped) task results.

    Raises:
        SKIP: If input is `None`

    Returns:
        List: Filtered list with SKIPs, Nones and Errors removed
    """
    if isinstance(task_results, list):
        return [
            r
            for r in task_results
            if not isinstance(r, (BaseException, SKIP, type(None)))
        ]
    elif task_results is None:
        raise SKIP
