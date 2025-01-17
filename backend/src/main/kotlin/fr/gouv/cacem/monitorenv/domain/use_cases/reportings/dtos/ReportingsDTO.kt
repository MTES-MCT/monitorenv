package fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ControlStatusEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity

data class ReportingsDTO(
    val reporting: ReportingEntity,
    val reportingSources: List<ReportingSourceDTO>,
    val attachedMission: MissionEntity? = null,
) {
    val controlStatus: ControlStatusEnum?
        get() =
            when {
                this.reporting.attachedEnvActionId != null &&
                    this.attachedMission?.envActions
                        ?.find { it.id == this.reporting.attachedEnvActionId }
                        ?.actionType == ActionTypeEnum.SURVEILLANCE ->
                    ControlStatusEnum.SURVEILLANCE_DONE

                this.reporting.attachedEnvActionId != null &&
                    this.attachedMission?.envActions
                        ?.find { it.id == this.reporting.attachedEnvActionId }
                        ?.actionType == ActionTypeEnum.CONTROL ->
                    ControlStatusEnum.CONTROL_DONE

                this.reporting.attachedEnvActionId == null &&
                    this.reporting.isControlRequired == true ->
                    ControlStatusEnum.CONTROL_TO_BE_DONE

                else -> null
            }
}
