package fr.gouv.cacem.monitorenv.domain.use_cases.station

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.exceptions.CouldNotDeleteException
import fr.gouv.cacem.monitorenv.domain.repositories.IStationRepository

@UseCase
class DeleteStation(
    private val stationRepository: IStationRepository,
    private val canDeleteStation: CanDeleteStation,
) {
    fun execute(stationId: Int) {
        if (!canDeleteStation.execute(stationId)) {
            throw CouldNotDeleteException(
                "Cannot delete station (ID=$stationId) due to existing relationships.",
            )
        }

        stationRepository.deleteById(stationId)
    }
}
