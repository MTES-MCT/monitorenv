from dataclasses import dataclass, field
from typing import List

from prefect import Flow
from prefect.client.schemas.objects import (
    ConcurrencyLimitConfig,
    ConcurrencyLimitStrategy,
)
from prefect.runner.storage import LocalStorage
from prefect.schedules import Schedule

from config import (
    HOST_ENV_FILE_LOCATION,
    PREFECT_API_URL,
    VESSEL_FILES_DIRECTORY,
    VESSEL_FILES_GID,
)
from src.flows.admin_areas import administrative_areas_flow
from src.flows.amp_cacem import import_amp_cacem_flow
from src.flows.amp_ofb import update_amp_from_ofb_flow
from src.flows.beaches import beaches_flow
from src.flows.competence_cross_areas import competence_cross_areas_flow
from src.flows.control_objectives import control_objectives_flow

################################# List flows to deploy ################################


def default_concurrency_limit() -> ConcurrencyLimitConfig:
    return ConcurrencyLimitConfig(
        limit=1, collision_strategy=ConcurrencyLimitStrategy.CANCEL_NEW
    )


@dataclass
class FlowAndSchedules:
    flow: Flow
    schedules: List[Schedule] = None
    concurrency_limit: ConcurrencyLimitConfig = field(
        default_factory=default_concurrency_limit
    )


flows_to_deploy = [
    FlowAndSchedules(flow=administrative_areas_flow),
    FlowAndSchedules(flow=beaches_flow),
    FlowAndSchedules(flow=competence_cross_areas_flow),
    FlowAndSchedules(flow=control_objectives_flow),
    FlowAndSchedules(
        flow=import_amp_cacem_flow, schedules=[Schedule(cron="22 0 * * *")]
    ),
    FlowAndSchedules(
        flow=update_amp_from_ofb_flow, schedules=[Schedule(cron="2 0 * * *")]
    ),
]


deployments = [
    flow_to_deploy.flow.to_deployment(
        name=flow_to_deploy.flow.name,
        schedules=flow_to_deploy.schedules,
        concurrency_limit=flow_to_deploy.concurrency_limit,
    )
    for flow_to_deploy in flows_to_deploy
]

################### Define flows' run config ####################
for deployment in deployments:
    deployment.job_variables = {
        "env": {"PREFECT_API_URL": PREFECT_API_URL},
        "volumes": [
            f"{HOST_ENV_FILE_LOCATION}:/home/monitorenv-pipeline/pipeline/.env"
        ],
        "auto_remove": True,
        "image_pull_policy": "IfNotPresent",
    }
    deployment.work_pool_name = "monitorenv"
    deployment.storage = LocalStorage("/home/monitorenv-pipeline/pipeline")

    if deployment.name in ("Control objectives",):
        deployment.job_variables["container_create_kwargs"] = {
            "group_add": [VESSEL_FILES_GID]
        }
        deployment.job_variables["volumes"].append(
            f"{VESSEL_FILES_DIRECTORY}:/home/monitorenv-pipeline/pipeline/src/data"
        )
