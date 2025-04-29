package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionNoteEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionSurveillance.EnvActionSurveillanceEntity
import java.time.ZonedDateTime
import java.util.UUID

abstract class MissionEnvActionDataOutput(
    open val id: UUID?,
    open val actionStartDateTimeUtc: ZonedDateTime? = null,
    open val actionType: ActionTypeEnum,
    open val observationsByUnit: String? = null,
) {
    companion object {
        fun fromEnvActionEntity(envActionEntity: EnvActionEntity): MissionEnvActionDataOutput =
            when (envActionEntity) {
                is EnvActionControlEntity ->
                    MissionEnvActionControlDataOutput.fromEnvActionControlEntity(
                        envActionControlEntity = envActionEntity,
                    )

                is EnvActionSurveillanceEntity ->
                    MissionEnvActionSurveillanceDataOutput.fromEnvActionSurveillanceEntity(
                        envActionSurveillanceEntity =
                        envActionEntity,
                    )

                else ->
                    MissionEnvActionNoteDataOutput.fromEnvActionNoteEntity(
                        envActionEntity as EnvActionNoteEntity,
                    )
            }
    }
}
