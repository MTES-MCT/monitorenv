package fr.gouv.cacem.monitorenv.domain.entities.mission.envAction

import java.time.ZonedDateTime
import java.util.UUID

data class EnvActionNoteProperties(
    val observations: String? = null,
) {
    fun toEnvActionNoteEntity(
        id: UUID,
        actionStartDateTimeUtc: ZonedDateTime?,
        missionId: Int?,
    ) =
        EnvActionNoteEntity(
            id = id,
            actionStartDateTimeUtc = actionStartDateTimeUtc,
            missionId = missionId,
            observations = observations,
        )

    companion object {
        fun fromEnvActionNoteEntity(envAction: EnvActionNoteEntity) =
            EnvActionNoteProperties(
                envAction.observations,
            )
    }
}
