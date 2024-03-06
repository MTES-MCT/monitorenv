package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.CanDeleteMissionResponse
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IMonitorFishMissionActionsRepository
import org.slf4j.LoggerFactory

@UseCase
class CanDeleteMission(
    private val missionRepository: IMissionRepository,
    private val monitorFishMissionActionsRepository: IMonitorFishMissionActionsRepository,
) {
    private val logger = LoggerFactory.getLogger(CanDeleteMission::class.java)

    @Throws(IllegalArgumentException::class)
    fun execute(missionId: Int, source: MissionSourceEnum): CanDeleteMissionResponse {
        logger.info("Check if mission $missionId can be deleted")

        if (source == MissionSourceEnum.MONITORFISH) {
            val envActions = missionRepository.findById(missionId).envActions
            if (!envActions.isNullOrEmpty()) {
                return CanDeleteMissionResponse(
                    canDelete = false,
                    sources = listOf(MissionSourceEnum.MONITORENV),
                )
            }

            return CanDeleteMissionResponse(canDelete = true, sources = listOf())
        }

        try {
            val fishActions =
                monitorFishMissionActionsRepository.findFishMissionActionsById(missionId)
            if (fishActions.isNotEmpty()) {
                return CanDeleteMissionResponse(
                    canDelete = false,
                    sources = listOf(MissionSourceEnum.MONITORFISH),
                )
            }

            return CanDeleteMissionResponse(canDelete = true, sources = listOf())
        } catch (e: NoSuchElementException) {
            return CanDeleteMissionResponse(canDelete = false, sources = listOf())
        }
    }
}
