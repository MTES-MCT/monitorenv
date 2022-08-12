package fr.gouv.cacem.monitorenv.domain.entities.missions

import java.time.ZonedDateTime
import java.util.*

data class EnvActionNoteProperties(
  val actionStartDatetimeUtc: ZonedDateTime? = null,
  val observations: String? = null,
) {
  fun toEnvActionNoteEntity(id: UUID) = EnvActionNoteEntity(
    id = id,
    actionStartDatetimeUtc = actionStartDatetimeUtc,
    observations = observations
  )
}
