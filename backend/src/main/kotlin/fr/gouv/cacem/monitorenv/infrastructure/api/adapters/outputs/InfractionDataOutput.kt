package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs

import fr.gouv.cacem.monitorenv.domain.entities.infractions.InfractionEntity

data class InfractionDataOutput(
  val id: Int,
  val natinf_code: String,
  val regulation: String?,
  val infraction_category: String?,
  val infraction: String?
) {
  companion object {
    fun fromInfractionEntity(infraction: InfractionEntity) = InfractionDataOutput(
      id = infraction.id,
      natinf_code = infraction.natinf_code,
      regulation = infraction.regulation,
      infraction_category = infraction.infraction_category,
      infraction = infraction.infraction
    )
  }
}
