package fr.gouv.cacem.monitorenv.domain.use_cases.station

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IStationRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.station.dtos.FullStationDTO
import org.slf4j.LoggerFactory

@UseCase
class GetStationById(
    private val stationRepository: IStationRepository,
) {
    private val logger = LoggerFactory.getLogger(GetStationById::class.java)

    fun execute(stationId: Int): FullStationDTO {
        logger.info("GET station $stationId")
        stationRepository.findById(stationId)?.let {
            return it
        }
        val errorMessage = "station $stationId not found"
        logger.error(errorMessage)
        throw BackendUsageException(BackendUsageErrorCode.ENTITY_NOT_FOUND, errorMessage)
    }
}
