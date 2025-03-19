package fr.gouv.cacem.monitorenv.domain.use_cases.station

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IStationRepository
import org.slf4j.LoggerFactory

@UseCase
class CanDeleteStation(
    private val stationRepository: IStationRepository,
) {
    private val logger = LoggerFactory.getLogger(CanDeleteStation::class.java)

    fun execute(stationId: Int): Boolean {
        logger.info("Can station $stationId be deleted")
        val fullStation = stationRepository.findById(stationId)

        return fullStation.controlUnitResources.isEmpty()
    }
}
