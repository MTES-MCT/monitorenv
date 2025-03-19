package fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ControlStatusEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity

fun getControlStatus(
    reporting: ReportingEntity,
    attachedMission: MissionEntity?,
): ControlStatusEnum? =
    when {
        reporting.attachedEnvActionId != null &&
            attachedMission
                ?.envActions
                ?.find { it.id == reporting.attachedEnvActionId }
                ?.actionType == ActionTypeEnum.SURVEILLANCE ->
            ControlStatusEnum.SURVEILLANCE_DONE

        reporting.attachedEnvActionId != null &&
            attachedMission
                ?.envActions
                ?.find { it.id == reporting.attachedEnvActionId }
                ?.actionType == ActionTypeEnum.CONTROL ->
            ControlStatusEnum.CONTROL_DONE

        reporting.attachedEnvActionId == null && reporting.isControlRequired == true ->
            ControlStatusEnum.CONTROL_TO_BE_DONE

        else -> null
    }
