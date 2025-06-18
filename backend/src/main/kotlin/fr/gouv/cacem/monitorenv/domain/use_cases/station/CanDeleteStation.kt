package fr.gouv.cacem.monitorenv.domain.use_cases.station

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IStationRepository
import org.slf4j.LoggerFactory

@UseCase
class CanDeleteStation(
    private val stationRepository: IStationRepository,
) {
    private val logger = LoggerFactory.getLogger(CanDeleteStation::class.java)

    fun execute(stationId: Int): Boolean {
        logger.info("Can station $stationId be deleted")
        stationRepository.findById(stationId)?.let {
            return it.controlUnitResources.isEmpty()
        }
        val errorMessage = "station $stationId not found for deletion"
        logger.error(errorMessage)
        throw BackendUsageException(BackendUsageErrorCode.ENTITY_NOT_FOUND, errorMessage)
    }
}
