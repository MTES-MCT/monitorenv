package fr.gouv.cacem.monitorenv.domain.entities.missions

import java.time.ZonedDateTime
import java.util.*

data class EnvActionNoteProperties(
    val observations: String? = null
) {
    fun toEnvActionNoteEntity(id: UUID, actionStartDateTimeUtc: ZonedDateTime?) = EnvActionNoteEntity(
        id = id,
        actionStartDateTimeUtc = actionStartDateTimeUtc,
        observations = observations
    )
    companion object {
        fun fromEnvActionNoteEntity(envAction: EnvActionNoteEntity) = EnvActionNoteProperties(
            envAction.observations
        )
    }
}
