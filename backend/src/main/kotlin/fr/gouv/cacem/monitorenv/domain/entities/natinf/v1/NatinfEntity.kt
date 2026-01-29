package fr.gouv.cacem.monitorenv.domain.entities.natinf.v1

data class NatinfEntity(
    val natinfCode: Int,
    val regulation: String?,
    val infractionCategory: String?,
    val infraction: String?,
)
