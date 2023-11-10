package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.use_cases.station.dtos.FullStationDTO

data class FullStationDataOutput(
    val id: Int,
    val controlUnitResourceIds: List<Int>,
    val controlUnitResources: List<ControlUnitResourceDataOutput>,
    val latitude: Double,
    val longitude: Double,
    val name: String,
) {
    companion object {
        fun fromFullStation(fullStation: FullStationDTO): FullStationDataOutput {
            val controlUnitResources =
                fullStation.controlUnitResources.map { ControlUnitResourceDataOutput.fromControlUnitResource(it) }

            return FullStationDataOutput(
                id = requireNotNull(fullStation.station.id),
                controlUnitResourceIds = controlUnitResources.map { it.id },
                controlUnitResources,
                latitude = fullStation.station.latitude,
                longitude = fullStation.station.longitude,
                name = fullStation.station.name,
            )
        }
    }
}
