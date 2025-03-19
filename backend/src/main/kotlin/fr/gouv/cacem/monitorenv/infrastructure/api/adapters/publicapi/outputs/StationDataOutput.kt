package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.station.StationEntity

data class StationDataOutput(
    val id: Int,
    val latitude: Double,
    val longitude: Double,
    val name: String,
) {
    companion object {
        fun fromStation(station: StationEntity): StationDataOutput =
            StationDataOutput(
                id = requireNotNull(station.id),
                latitude = station.latitude,
                longitude = station.longitude,
                name = station.name,
            )
    }
}
