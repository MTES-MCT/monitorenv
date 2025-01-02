package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.dashboard.DeleteDashboard
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO
import org.slf4j.LoggerFactory

@UseCase
class GetFullMission(
    private val missionRepository: IMissionRepository,
) {
    private val logger = LoggerFactory.getLogger(DeleteDashboard::class.java)

    fun execute(missionId: Int): MissionDTO {
        logger.info("GET full mission $missionId with fish and rapport nav action")
        missionRepository.findFullMissionById(missionId)?.let {
            return it
        }
        throw BackendUsageException(BackendUsageErrorCode.ENTITY_NOT_FOUND, "mission $missionId not found")
    }
}
