package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.PatchableMissionEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.mappers.PatchEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDetailsDTO
import org.slf4j.LoggerFactory

@UseCase
class PatchMission(
    private val missionRepository: IMissionRepository,
    private val patchEntity: PatchEntity<MissionEntity, PatchableMissionEntity>,
) {
    private val logger = LoggerFactory.getLogger(GetFullMissionWithFishAndRapportNavActions::class.java)

    fun execute(
        id: Int,
        patchableMissionEntity: PatchableMissionEntity,
    ): MissionDetailsDTO {
        logger.info("Attempt to PATCH mission $id")
        missionRepository.findById(id)?.let {
            patchEntity.execute(it, patchableMissionEntity)
            val patchedMission = missionRepository.save(it)
            logger.info("Mission $id patched")
            return patchedMission
        }
        val errorMessage = "Mission $id not found"
        logger.error(errorMessage)
        throw BackendUsageException(BackendUsageErrorCode.ENTITY_NOT_FOUND, errorMessage)
    }
}
