package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.missions

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionNoteEntity
import java.time.ZonedDateTime
import java.util.UUID

data class MissionEnvActionNoteDataOutput(
    override val id: UUID,
    override val actionEndDateTimeUtc: ZonedDateTime? = null,
    override val actionStartDateTimeUtc: ZonedDateTime? = null,
    override val actionType: ActionTypeEnum = ActionTypeEnum.NOTE,
    val observations: String? = null,
) : MissionEnvActionDataOutput(
    id = id,
    actionEndDateTimeUtc = actionEndDateTimeUtc,
    actionStartDateTimeUtc = actionStartDateTimeUtc,
    actionType = ActionTypeEnum.CONTROL,
) {
    companion object {
        fun fromEnvActionNoteEntity(envActionNoteEntity: EnvActionNoteEntity) = MissionEnvActionNoteDataOutput(
            id = envActionNoteEntity.id,
            actionStartDateTimeUtc = envActionNoteEntity.actionStartDateTimeUtc,
            actionEndDateTimeUtc = envActionNoteEntity.actionEndDateTimeUtc,
            observations = envActionNoteEntity.observations,
        )
    }
}
