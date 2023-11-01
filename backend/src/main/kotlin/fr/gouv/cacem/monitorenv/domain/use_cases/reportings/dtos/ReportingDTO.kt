package fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ControlStatusEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.semaphore.SemaphoreEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitDTO

data class ReportingDTO(
    val reporting: ReportingEntity,
    val semaphore: SemaphoreEntity? = null,
    val controlUnit: FullControlUnitDTO? = null,
    val attachedMission: MissionEntity? = null,
    val detachedMission: MissionEntity? = null
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
