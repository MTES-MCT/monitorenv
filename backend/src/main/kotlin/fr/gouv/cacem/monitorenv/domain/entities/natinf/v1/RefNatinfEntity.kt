package fr.gouv.cacem.monitorenv.domain.entities.natinf.v1

data class RefNatinfEntity(
    val id: Int,
    val nature: String?,
    val qualification: String?,
    val definedBy: String?,
    val repressedBy: String?,
)
