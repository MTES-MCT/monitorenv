package fr.gouv.cacem.monitorenv.domain.use_cases.station

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.station.StationEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IStationRepository
import org.slf4j.LoggerFactory

@UseCase
class CreateOrUpdateStation(
    private val stationRepository: IStationRepository,
) {
    private val logger = LoggerFactory.getLogger(CreateOrUpdateStation::class.java)

    fun execute(station: StationEntity): StationEntity {
        logger.info("Attempt to CREATE or UPDATE station ${station.id}")
        val savedStation = stationRepository.save(station)
        logger.info("Station ${savedStation.id} created or updated")

        return savedStation
    }
}
