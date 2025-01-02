package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import org.slf4j.LoggerFactory

@UseCase
class CanDeleteControlUnitResource(
    private val missionRepository: IMissionRepository,
) {
    private val logger = LoggerFactory.getLogger(CanDeleteControlUnitResource::class.java)

    fun execute(controlUnitResourceId: Int): Boolean {
        logger.info("Can control unit resource $controlUnitResourceId be deleted")
        val missions = missionRepository.findByControlUnitResourceId(controlUnitResourceId)

        return missions.isEmpty()
    }
}
