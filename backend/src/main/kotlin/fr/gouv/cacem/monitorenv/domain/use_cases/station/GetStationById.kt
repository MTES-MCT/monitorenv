package fr.gouv.cacem.monitorenv.domain.use_cases.station

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IStationRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.station.dtos.FullStationDTO

@UseCase
class GetStationById(private val stationRepository: IStationRepository) {
    fun execute(stationId: Int): FullStationDTO {
        return stationRepository.findById(stationId)
    }
}
