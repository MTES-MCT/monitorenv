package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.CanDeleteMissionResponse
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IMonitorFishMissionActionsRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IRapportNavMissionActionsRepository
import org.slf4j.LoggerFactory

@UseCase
class CanDeleteMission(
    private val missionRepository: IMissionRepository,
    private val monitorFishMissionActionsRepository: IMonitorFishMissionActionsRepository,
    private val rapportNavMissionActionsRepository: IRapportNavMissionActionsRepository,
) {
    private val logger = LoggerFactory.getLogger(CanDeleteMission::class.java)

    @Throws(IllegalArgumentException::class)
    fun execute(
        missionId: Int,
        source: MissionSourceEnum,
    ): CanDeleteMissionResponse {
        logger.info("Can mission $missionId be deleted")

        if (source == MissionSourceEnum.MONITORFISH) {
            return canMonitorFishDeleteMission(missionId)
        }

        return canMonitorEnvDeleteMission(missionId)
    }

    private fun canMonitorFishDeleteMission(missionId: Int): CanDeleteMissionResponse {
        missionRepository.findById(missionId)?.let {
            val envActions = it.envActions
            val rapportNavActions = rapportNavMissionActionsRepository.findRapportNavMissionActionsById(missionId)

            if (!envActions.isNullOrEmpty() && rapportNavActions.containsActionsAddedByUnit) {
                return CanDeleteMissionResponse(
                    canDelete = false,
                    sources = listOf(MissionSourceEnum.MONITORENV, MissionSourceEnum.RAPPORT_NAV),
                )
            }

            if (envActions.isNullOrEmpty() && rapportNavActions.containsActionsAddedByUnit) {
                return CanDeleteMissionResponse(
                    canDelete = false,
                    sources = listOf(MissionSourceEnum.RAPPORT_NAV),
                )
            }

            if (!envActions.isNullOrEmpty() &&
                !rapportNavActions.containsActionsAddedByUnit
            ) {
                return CanDeleteMissionResponse(
                    canDelete = false,
                    sources = listOf(MissionSourceEnum.MONITORENV),
                )
            }

            return CanDeleteMissionResponse(canDelete = true, sources = listOf())
        }
        logger.info("mission $missionId does not exist")
        return CanDeleteMissionResponse(canDelete = false, sources = listOf())
    }

    private fun canMonitorEnvDeleteMission(missionId: Int): CanDeleteMissionResponse {
        try {
            val fishActions =
                monitorFishMissionActionsRepository.findFishMissionActionsById(missionId)

            val rapportNavActions = rapportNavMissionActionsRepository.findRapportNavMissionActionsById(missionId)

            if (fishActions.isNotEmpty() && rapportNavActions.containsActionsAddedByUnit) {
                return CanDeleteMissionResponse(
                    canDelete = false,
                    sources = listOf(MissionSourceEnum.MONITORFISH, MissionSourceEnum.RAPPORT_NAV),
                )
            }

            if (fishActions.isEmpty() && rapportNavActions.containsActionsAddedByUnit) {
                return CanDeleteMissionResponse(
                    canDelete = false,
                    sources = listOf(MissionSourceEnum.RAPPORT_NAV),
                )
            }

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
