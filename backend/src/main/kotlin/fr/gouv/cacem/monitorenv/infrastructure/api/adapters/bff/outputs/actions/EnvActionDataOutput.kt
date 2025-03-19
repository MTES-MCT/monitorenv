package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.actions

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionNoteEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionSurveillance.EnvActionSurveillanceEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.EnvActionAttachedToReportingIds
import java.time.ZonedDateTime
import java.util.UUID

abstract class EnvActionDataOutput(
    open val id: UUID,
    open val actionStartDateTimeUtc: ZonedDateTime? = null,
    open val actionType: ActionTypeEnum,
) {
    companion object {
        fun fromEnvActionEntity(
            envActionEntity: EnvActionEntity,
            envActionsAttachedToReportingIds: List<EnvActionAttachedToReportingIds>?,
        ): EnvActionDataOutput =
            when (envActionEntity.actionType) {
                ActionTypeEnum.CONTROL ->
                    EnvActionControlDataOutput.fromEnvActionControlEntity(
                        envActionControlEntity = envActionEntity as EnvActionControlEntity,
                        reportingIds =
                            envActionsAttachedToReportingIds
                                ?.find { id -> id.first == envActionEntity.id }
                                ?.second
                                ?: listOf(),
                    )

                ActionTypeEnum.SURVEILLANCE ->
                    EnvActionSurveillanceDataOutput.fromEnvActionSurveillanceEntity(
                        envActionSurveillanceEntity =
                            envActionEntity as EnvActionSurveillanceEntity,
                        reportingIds =
                            envActionsAttachedToReportingIds
                                ?.find { id -> id.first == envActionEntity.id }
                                ?.second
                                ?: listOf(),
                    )

                ActionTypeEnum.NOTE ->
                    EnvActionNoteDataOutput.fromEnvActionNoteEntity(
                        envActionEntity as EnvActionNoteEntity,
                    )
            }
    }
}
