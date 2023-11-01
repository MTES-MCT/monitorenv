package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository

@UseCase
class CanDeleteControlUnit(
    private val missionRepository: IMissionRepository,
    private val reportingRepository: IReportingRepository
) {
    fun execute(controlUnitId: Int): Boolean {
        val missions = missionRepository.findByControlUnitId(controlUnitId)
        val reportings = reportingRepository.findByControlUnitId(controlUnitId)

        return missions.isEmpty() && reportings.isEmpty()
    }
}
