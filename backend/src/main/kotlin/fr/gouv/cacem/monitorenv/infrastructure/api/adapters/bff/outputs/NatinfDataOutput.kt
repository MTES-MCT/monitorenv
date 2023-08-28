package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.entities.natinf.NatinfEntity

data class NatinfDataOutput(
    val natinfCode: Int,
    val regulation: String?,
    val infractionCategory: String?,
    val infraction: String?,
) {
    companion object {
        fun fromNatinfEntity(natinf: NatinfEntity) = NatinfDataOutput(
            natinfCode = natinf.natinfCode,
            regulation = natinf.regulation,
            infractionCategory = natinf.infractionCategory,
            infraction = natinf.infraction,
        )
    }
}
