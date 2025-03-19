package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs

import fr.gouv.cacem.monitorenv.domain.entities.station.StationEntity

data class CreateOrUpdateStationDataInput(
    val id: Int? = null,
    val latitude: Double,
    val longitude: Double,
    val name: String,
) {
    fun toStation(): StationEntity =
        StationEntity(
            id = this.id,
            latitude = this.latitude,
            longitude = this.longitude,
            name = this.name,
        )
}
