package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs

import fr.gouv.cacem.monitorenv.domain.entities.natinfs.NatinfEntity

data class NatinfDataOutput(
  val id: Int,
  val natinfCode: String,
  val regulation: String?,
  val infractionCategory: String?,
  val infraction: String?
) {
  companion object {
    fun fromNatinfEntity(natinf: NatinfEntity) = NatinfDataOutput(
      id = natinf.id,
      natinfCode = natinf.natinfCode,
      regulation = natinf.regulation,
      infractionCategory = natinf.infractionCategory,
      infraction = natinf.infraction
    )
  }
}
