package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.missions

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionNoteEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionSurveillanceEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.EnvActionAttachedToReportingIds
import java.time.ZonedDateTime
import java.util.UUID

abstract class MissionEnvActionDataOutput(
    open val id: UUID,
    open val actionStartDateTimeUtc: ZonedDateTime? = null,
    open val actionType: ActionTypeEnum,
) {
    companion object {
        fun fromEnvActionEntity(
            envActionEntity: EnvActionEntity,
            envActionsAttachedToReportingIds: List<EnvActionAttachedToReportingIds>?,
        ): MissionEnvActionDataOutput {
            return when (envActionEntity.actionType) {
                ActionTypeEnum.CONTROL ->
                    MissionEnvActionControlDataOutput
                        .fromEnvActionControlEntity(
                            envActionControlEntity = envActionEntity as EnvActionControlEntity,
                            reportingIds = envActionsAttachedToReportingIds?.find { id ->
                                id.first == envActionEntity.id
                            }?.second ?: listOf(),
                        )
                ActionTypeEnum.SURVEILLANCE ->
                    MissionEnvActionSurveillanceDataOutput
                        .fromEnvActionSurveillanceEntity(
                            envActionSurveillanceEntity = envActionEntity as EnvActionSurveillanceEntity,
                            reportingIds = envActionsAttachedToReportingIds?.find { id ->
                                id.first == envActionEntity.id
                            }?.second ?: listOf(),
                        )
                ActionTypeEnum.NOTE ->
                    MissionEnvActionNoteDataOutput.fromEnvActionNoteEntity(
                        envActionEntity as EnvActionNoteEntity,
                    )
            }
        }
    }
}
