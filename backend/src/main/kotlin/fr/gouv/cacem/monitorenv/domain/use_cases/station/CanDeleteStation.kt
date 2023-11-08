package fr.gouv.cacem.monitorenv.domain.use_cases.station

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IStationRepository

@UseCase
class CanDeleteStation(private val stationRepository: IStationRepository) {
    fun execute(stationId: Int): Boolean {
        val fullStation = stationRepository.findById(stationId)

        return fullStation.controlUnitResources.isEmpty()
    }
}
