package fr.gouv.cacem.monitorenv.domain.entities.base

data class BaseEntity(
    val id: Int? = null,
    val controlUnitResourceIds: List<Int>,
    val name: String,
)
