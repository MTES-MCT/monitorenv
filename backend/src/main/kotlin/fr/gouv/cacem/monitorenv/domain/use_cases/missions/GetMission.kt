package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import org.slf4j.LoggerFactory

@UseCase
class GetMission(
    private val missionRepository: IMissionRepository,
) {
    private val logger = LoggerFactory.getLogger(GetMission::class.java)

    fun execute(missionId: Int): MissionEntity {
        logger.info("GET mission $missionId")
        missionRepository.findById(missionId)?.let {
            return it
        }
        val errorMessage = "mission $missionId not found"
        logger.error(errorMessage)
        throw BackendUsageException(BackendUsageErrorCode.ENTITY_NOT_FOUND, errorMessage)
    }
}
