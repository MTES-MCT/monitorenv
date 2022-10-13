package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs

import fr.gouv.cacem.monitorenv.domain.entities.natinfs.NatinfEntity

data class NatinfDataOutput(
  val id: Int,
  val natinf_code: String,
  val regulation: String?,
  val infractionCategory: String?,
  val infraction: String?
) {
  companion object {
    fun fromNatinfEntity(natinf: NatinfEntity) = NatinfDataOutput(
      id = natinf.id,
      natinf_code = natinf.natinf_code,
      regulation = natinf.regulation,
      infractionCategory = natinf.infractionCategory,
      infraction = natinf.infraction
    )
  }
}
