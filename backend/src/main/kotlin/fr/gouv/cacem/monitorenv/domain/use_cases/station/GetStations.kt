package fr.gouv.cacem.monitorenv.domain.use_cases.station

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IStationRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.station.dtos.FullStationDTO
import org.slf4j.LoggerFactory

@UseCase
class GetStations(private val stationRepository: IStationRepository) {
    private val logger = LoggerFactory.getLogger(GetStations::class.java)

    fun execute(): List<FullStationDTO> {
        logger.info("Attempt to GET all stations")
        val fullStations = stationRepository.findAll()

        logger.info("Found ${fullStations.size} stations")

        return fullStations
    }
}
