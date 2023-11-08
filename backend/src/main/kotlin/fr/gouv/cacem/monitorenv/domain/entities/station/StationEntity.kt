package fr.gouv.cacem.monitorenv.domain.entities.station

data class StationEntity(
    val id: Int? = null,
    val latitude: Double,
    val longitude: Double,
    val name: String,
)
