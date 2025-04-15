package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionNoteEntity
import java.time.ZonedDateTime
import java.util.UUID

data class MissionEnvActionNoteDataOutput(
    override val id: UUID?,
    override val actionStartDateTimeUtc: ZonedDateTime? = null,
    override val actionType: ActionTypeEnum = ActionTypeEnum.NOTE,
    override val observationsByUnit: String? = null,
    val observations: String? = null,
) : MissionEnvActionDataOutput(
        id = id,
        actionStartDateTimeUtc = actionStartDateTimeUtc,
        actionType = ActionTypeEnum.NOTE,
        observationsByUnit = observationsByUnit,
    ) {
    companion object {
        fun fromEnvActionNoteEntity(envActionNoteEntity: EnvActionNoteEntity) =
            MissionEnvActionNoteDataOutput(
                id = envActionNoteEntity.id,
                actionStartDateTimeUtc = envActionNoteEntity.actionStartDateTimeUtc,
                observations = envActionNoteEntity.observations,
                observationsByUnit = envActionNoteEntity.observationsByUnit,
            )
    }
}
