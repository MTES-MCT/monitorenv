package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
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

            return envActions !== null && envActions.isEmpty()
        }

        val fishActions = getFishMissionActionsById.execute(missionId)
        return fishActions.isEmpty()
    }
}
