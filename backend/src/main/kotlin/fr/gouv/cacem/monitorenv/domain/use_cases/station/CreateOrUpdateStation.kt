package fr.gouv.cacem.monitorenv.domain.use_cases.station

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.station.StationEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IStationRepository

@UseCase
class CreateOrUpdateStation(private val stationRepository: IStationRepository) {
    fun execute(station: StationEntity): StationEntity {
        return stationRepository.save(station)
    }
}
