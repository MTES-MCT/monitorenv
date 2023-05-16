package fr.gouv.cacem.monitorenv.domain.entities.natinfs

data class NatinfEntity(
    val natinfCode: Int,
    val regulation: String?,
    val infractionCategory: String?,
    val infraction: String?,
)
