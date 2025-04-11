package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.actions

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionNoteEntity
import java.time.ZonedDateTime
import java.util.UUID

data class EnvActionNoteDataOutput(
    override val id: UUID?,
    override val actionStartDateTimeUtc: ZonedDateTime? = null,
    override val actionType: ActionTypeEnum = ActionTypeEnum.NOTE,
    val observations: String? = null,
) : EnvActionDataOutput(
        id = id,
        actionStartDateTimeUtc = actionStartDateTimeUtc,
        actionType = ActionTypeEnum.NOTE,
    ) {
    companion object {
        fun fromEnvActionNoteEntity(envActionNoteEntity: EnvActionNoteEntity) =
            EnvActionNoteDataOutput(
                id = envActionNoteEntity.id,
                actionStartDateTimeUtc = envActionNoteEntity.actionStartDateTimeUtc,
                observations = envActionNoteEntity.observations,
            )
    }
}
