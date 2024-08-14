package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionNoteEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionSurveillanceEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import java.time.ZonedDateTime
import java.util.*

abstract class MissionEnvActionDataOutput(
    open val id: UUID,
    open val actionStartDateTimeUtc: ZonedDateTime? = null,
    open val actionEndDateTimeUtc: ZonedDateTime? = null,
    open val actionType: ActionTypeEnum,
    open val observationsByUnit: String? = null,
) {
    companion object {
        fun fromEnvActionEntity(
            envActionEntity: EnvActionEntity,
        ): MissionEnvActionDataOutput {
            return when (envActionEntity.actionType) {
                ActionTypeEnum.CONTROL ->
                    MissionEnvActionControlDataOutput.fromEnvActionControlEntity(
                        envActionControlEntity = envActionEntity as EnvActionControlEntity,
                    )

                ActionTypeEnum.SURVEILLANCE ->
                    MissionEnvActionSurveillanceDataOutput.fromEnvActionSurveillanceEntity(
                        envActionSurveillanceEntity =
                        envActionEntity as EnvActionSurveillanceEntity,
                    )

                ActionTypeEnum.NOTE ->
                    MissionEnvActionNoteDataOutput.fromEnvActionNoteEntity(
                        envActionEntity as EnvActionNoteEntity,
                    )
            }
        }
    }
}
