package fr.gouv.cacem.monitorenv.domain.entities.mission.envAction

import fr.gouv.cacem.monitorenv.domain.entities.mission.ActionCompletionEnum
import java.time.ZonedDateTime
import java.util.*

data class EnvActionNoteProperties(
    val observations: String? = null,
) {
    fun toEnvActionNoteEntity(
        id: UUID,
        actionStartDateTimeUtc: ZonedDateTime?,
        completion: ActionCompletionEnum?,
        missionId: Int?,
        observationsByUnit: String?,
    ) = EnvActionNoteEntity(
        id = id,
        actionStartDateTimeUtc = actionStartDateTimeUtc,
        completion = completion,
        missionId = missionId,
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
