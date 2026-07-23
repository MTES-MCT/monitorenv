package fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea

data class RegulatoryAreaGroupEntity(
    val id: Int,
    val location: String?,
    val regulatoryAreaIds: List<Int>,
    val type: String?,
)
