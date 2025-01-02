package fr.gouv.cacem.monitorenv.domain.use_cases.station

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.exceptions.CouldNotDeleteException
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
            throw CouldNotDeleteException(
                "Cannot delete station (ID=$stationId) due to existing relationships.",
            )
        }
        stationRepository.deleteById(stationId)
        logger.info("Station $stationId deleted")
    }
}
