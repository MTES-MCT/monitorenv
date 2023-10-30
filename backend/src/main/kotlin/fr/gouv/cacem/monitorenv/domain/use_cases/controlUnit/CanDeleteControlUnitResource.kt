package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository

@UseCase
class CanDeleteControlUnitResource(
    private val missionRepository: IMissionRepository,
) {
    fun execute(controlUnitId: Int): Boolean {
        val missions = missionRepository.findByControlUnitId(controlUnitId)

        return missions.isEmpty()
    }
}
