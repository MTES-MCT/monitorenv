package fr.gouv.cacem.monitorenv.domain.use_cases.station

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IStationRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.station.dtos.FullStationDTO
import org.slf4j.LoggerFactory

@UseCase
class GetStationById(private val stationRepository: IStationRepository) {
    private val logger = LoggerFactory.getLogger(GetStationById::class.java)

    fun execute(stationId: Int): FullStationDTO {
        logger.info("GET station $stationId")
        return stationRepository.findById(stationId)
    }
}
