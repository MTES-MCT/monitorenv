package fr.gouv.cacem.monitorenv.domain.entities.natinfs

data class NatinfEntity(
    val id: Int,
    val natinf_code: String,
    val regulation: String?,
    val infractionCategory: String?,
    val infraction: String?
)
