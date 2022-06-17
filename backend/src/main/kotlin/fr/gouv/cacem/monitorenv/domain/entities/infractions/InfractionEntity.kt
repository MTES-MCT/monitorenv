package fr.gouv.cacem.monitorenv.domain.entities.infractions

data class InfractionEntity(
  val id: Int,
  val natinf_code: String,
  val regulation: String?,
  val infraction_category: String?,
  val infraction: String?
)
