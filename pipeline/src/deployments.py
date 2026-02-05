from dataclasses import dataclass, field
from typing import List

from pipeline.src.flows.new_regulatory_areas import new_regulatory_areas_flow
from prefect import Flow
from prefect.client.schemas.objects import (
    ConcurrencyLimitConfig,
    ConcurrencyLimitStrategy,
)
from prefect.runner.storage import LocalStorage
from prefect.schedules import Schedule

from config import (
    EMAIL_ALL_UNITS,
    HOST_ENV_FILE_LOCATION,
    IS_INTEGRATION,
    PREFECT_API_URL,
    TEST_MODE,
    VESSEL_FILES_DIRECTORY,
    VESSEL_FILES_GID,
)
from src.flows.admin_areas import administrative_areas_flow
from src.flows.amp_cacem import import_amp_cacem_flow
from src.flows.amp_ofb import update_amp_from_ofb_flow
from src.flows.beaches import beaches_flow
from src.flows.competence_cross_areas import competence_cross_areas_flow
from src.flows.email_actions_to_units import email_actions_to_units_flow
from src.flows.facade_areas import facade_areas_flow
from src.flows.facade_areas_unextended import facade_areas_unextended_flow
from src.flows.fao_areas import fao_areas_flow
from src.flows.historic_control_units import historic_control_units_flow
from src.flows.historic_controls import historic_controls_flow
from src.flows.infractions import infractions_flow
from src.flows.localized_areas import localized_areas_flow
from src.flows.marpol import marpol_flow
from src.flows.refresh_materialized_view import refresh_materialized_view_flow
from src.flows.regulations import regulations_flow
from src.flows.regulations_open_data import regulations_open_data_flow
from src.flows.update_cacem_regulatory_areas import update_cacem_regulatory_areas_flow
from src.flows.remove_broken_missions_resources_links import (
    remove_broken_missions_resources_links_flow,
)
from src.flows.semaphores import semaphores_flow
from src.flows.themes_and_tags import themes_and_tags_flow
from src.flows.three_hundred_meters_areas import three_hunder_meters_areas_flow
from src.flows.update_departments_and_facades import (
    update_departments_and_facades_flow,
)
from src.flows.vessel_repository import vessel_repository_flow
from src.flows.last_positions import last_positions_flow

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
    FlowAndSchedules(
        flow=email_actions_to_units_flow,
        schedules=[
            Schedule(
                cron="0 5 * * 1",
                parameters={
                    "start_days_ago": 7,
                    "end_days_ago": 1,
                    "test_mode": TEST_MODE,
                    "is_integration": IS_INTEGRATION,
                    "email_all_units": EMAIL_ALL_UNITS,
                },
            ),
        ],
    ),
    FlowAndSchedules(flow=facade_areas_flow),
    FlowAndSchedules(flow=facade_areas_unextended_flow),
    FlowAndSchedules(flow=fao_areas_flow),
    FlowAndSchedules(flow=historic_control_units_flow),
    FlowAndSchedules(flow=historic_controls_flow),
    FlowAndSchedules(
        flow=import_amp_cacem_flow, schedules=[Schedule(cron="22 0 * * *")]
    ),
    FlowAndSchedules(
        flow=infractions_flow, schedules=[Schedule(cron="2 8,14 * * *")]
    ),
    FlowAndSchedules(flow=localized_areas_flow),
    FlowAndSchedules(flow=marpol_flow),
    FlowAndSchedules(
        flow=refresh_materialized_view_flow,
        schedules=[
            Schedule(
                cron="30 * * * *",
                parameters={"view_name": "analytics_actions"},
            ),
            Schedule(
                cron="35 12 * * *",
                parameters={"view_name": "analytics_surveillance_density_map"},
            ),
        ],
    ),
    FlowAndSchedules(
        flow=regulations_flow,
        schedules=[Schedule(cron="6,16,26,36,46,56 * * * *")],
    ),
    FlowAndSchedules(
        flow=regulations_open_data_flow,
        schedules=[Schedule(cron="0 20 * * 5")],
    ),
    FlowAndSchedules(
        flow=new_regulatory_areas_flow,
        schedules=[Schedule(cron="2,12,22,32,42,52 * * * *")],
    ),
    FlowAndSchedules(
        flow=update_cacem_regulatory_areas_flow,
        schedules=[Schedule(cron="6,16,26,36,46,56 * * * *")],
    ),
    FlowAndSchedules(flow=remove_broken_missions_resources_links_flow),
    FlowAndSchedules(
        flow=semaphores_flow,
        schedules=[Schedule(cron="3 5,15 * * *")],
    ),
    FlowAndSchedules(
        flow=themes_and_tags_flow,
        schedules=[Schedule(cron="2,12,22,32,42,52 * * * *")],
    ),
    FlowAndSchedules(flow=three_hunder_meters_areas_flow),
    FlowAndSchedules(
        flow=update_amp_from_ofb_flow, schedules=[Schedule(cron="2 0 * * *")]
    ),
    FlowAndSchedules(flow=update_departments_and_facades_flow),
    FlowAndSchedules(flow=vessel_repository_flow),
    FlowAndSchedules(flow=last_positions_flow),
]

deployments = []

for flow_to_deploy in flows_to_deploy:
    # Ensure flow name unicity among all projects orchestrated by Prefect 3
    assert flow_to_deploy.flow.name[:13] == "Monitorenv - "

    deployment = flow_to_deploy.flow.to_deployment(
        name=flow_to_deploy.flow.name,
        schedules=flow_to_deploy.schedules,
        concurrency_limit=flow_to_deploy.concurrency_limit,
        tags=["monitorenv"],
    )

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

    if deployment.name in ("Monitorenv - Vessel repository",):
        deployment.job_variables["container_create_kwargs"] = {
            "group_add": [VESSEL_FILES_GID]
        }
        deployment.job_variables["volumes"].append(
            f"{VESSEL_FILES_DIRECTORY}:/home/monitorenv-pipeline/pipeline/src/data"
        )

    deployments.append(deployment)
