package fr.gouv.cacem.monitorenv.domain.use_cases.station

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IStationRepository
import org.slf4j.LoggerFactory

@UseCase
class DeleteStation(
    private val stationRepository: IStationRepository,
    private val canDeleteStation: CanDeleteStation,
) {
    private val logger = LoggerFactory.getLogger(DeleteStation::class.java)

    fun execute(stationId: Int) {
        logger.info("Attempt to DELETE station $stationId")
        if (!canDeleteStation.execute(stationId)) {
            val errorMessage = "Cannot delete station (ID=$stationId) due to existing relationships."
            logger.error(errorMessage)
            throw BackendUsageException(BackendUsageErrorCode.CANNOT_DELETE_ENTITY, errorMessage)
        }
        stationRepository.deleteById(stationId)
        logger.info("Station $stationId deleted")
    }
}
