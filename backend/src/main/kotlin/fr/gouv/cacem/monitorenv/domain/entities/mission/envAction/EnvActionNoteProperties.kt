package fr.gouv.cacem.monitorenv.domain.entities.mission.envAction

import fr.gouv.cacem.monitorenv.domain.entities.mission.ActionCompletionEnum
import java.time.ZonedDateTime
import java.util.UUID

data class EnvActionNoteProperties(
    val observations: String? = null,
) {
    fun toEnvActionNoteEntity(
        id: UUID,
        actionStartDateTimeUtc: ZonedDateTime?,
        completion: ActionCompletionEnum?,
        observationsByUnit: String?,
    ) = EnvActionNoteEntity(
        id = id,
        actionStartDateTimeUtc = actionStartDateTimeUtc,
        completion = completion,
        observations = observations,
        observationsByUnit = observationsByUnit,
    )

    companion object {
        fun fromEnvActionNoteEntity(envAction: EnvActionNoteEntity) =
            EnvActionNoteProperties(
                envAction.observations,
            )
    }
}
