package fr.gouv.cacem.monitorenv.domain.entities.base

data class BaseEntity(
    val id: Int? = null,
    val latitude: Double,
    val longitude: Double,
    val name: String
)
