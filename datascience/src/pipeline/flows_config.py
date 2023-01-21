from dotenv import dotenv_values
from prefect.executors.dask import LocalDaskExecutor
from prefect.run_configs.docker import DockerRun
from prefect.schedules import CronSchedule
from prefect.storage.local import Local

from config import (
    DOCKER_IMAGE,
    FLOWS_LOCATION,
    MONITORENV_VERSION,
    ROOT_DIRECTORY,
)
from src.pipeline.flows import (
    admin_areas,
    facade_areas,
    fao_areas,
    historic_control_units,
    regulations,
)

################################ Define flow schedules ################################

regulations.flow.schedule = CronSchedule("6,16,26,36,46,56 * * * *")

###################### List flows to register with prefect server #####################
flows_to_register = [
    admin_areas.flow,
    facade_areas.flow,
    fao_areas.flow,
    historic_control_units.flow,
    regulations.flow,
]

################################ Define flows' executor ###############################
for flow in flows_to_register:
    flow.executor = LocalDaskExecutor()

################################ Define flows' storage ################################
# This defines where the executor can find the flow.py file for each flow **inside**
# the container.
for flow in flows_to_register:
    flow.storage = Local(
        add_default_labels=False,
        stored_as_script=True,
        path=(FLOWS_LOCATION / flow.file_name).as_posix(),
    )

################### Define flows' run config ####################
for flow in flows_to_register:
    host_config = None

    flow.run_config = DockerRun(
        image=f"{DOCKER_IMAGE}:{MONITORENV_VERSION}",
        host_config=host_config,
        env=dotenv_values(ROOT_DIRECTORY / ".env"),
        labels=["monitorenv"],
    )
