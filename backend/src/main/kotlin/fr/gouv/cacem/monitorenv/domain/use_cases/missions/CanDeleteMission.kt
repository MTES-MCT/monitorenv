package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.ErrorCode
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.monitorfish.GetFishMissionActionsById
import org.slf4j.LoggerFactory

@UseCase
class CanDeleteMission(
    private val missionRepository: IMissionRepository,
    private val getFishMissionActionsById: GetFishMissionActionsById,
) {
    private val logger = LoggerFactory.getLogger(GetFullMissions::class.java)

    @Throws(IllegalArgumentException::class)
    fun execute(missionId: Int?, source: MissionSourceEnum): Boolean {
        require(missionId != null) {
            "No mission to check"
        }
        logger.info("SOURCE $source")
        if (source === MissionSourceEnum.MONITORFISH) {
            val envActions = missionRepository.findById(missionId).envActions

            if (envActions !== null && envActions.isEmpty()) {
                return true
            }

            val errorSources = object {
                var sources = listOf(MissionSourceEnum.MONITORENV)
            }

            throw BackendUsageException(
                ErrorCode.EXISTING_MISSION_ACTION,
                errorSources,
            )
        }

        val fishActions = getFishMissionActionsById.execute(missionId)
        if (fishActions.isEmpty()) {
            return true
        }

        val errorSources = object {
            var sources = listOf(MissionSourceEnum.MONITORFISH)
        }
        throw BackendUsageException(
            ErrorCode.EXISTING_MISSION_ACTION,
            errorSources,
        )
    }
}
