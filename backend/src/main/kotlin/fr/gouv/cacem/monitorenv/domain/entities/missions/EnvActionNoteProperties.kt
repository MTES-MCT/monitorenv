package fr.gouv.cacem.monitorenv.domain.entities.missions

import java.util.*

data class EnvActionNoteProperties(
  val observations: String? = null,
) {
  fun toEnvActionNoteEntity(id: UUID) = EnvActionNoteEntity(
    id = id,
    observations = observations
  )
}
