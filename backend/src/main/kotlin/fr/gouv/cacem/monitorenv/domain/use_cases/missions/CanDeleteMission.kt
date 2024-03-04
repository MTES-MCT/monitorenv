package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.CanDeleteMissionResponse
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IMonitorFishMissionActionsRepository

@UseCase
class CanDeleteMission(
    private val missionRepository: IMissionRepository,
    private val monitorFishMissionActionsRepository: IMonitorFishMissionActionsRepository,
) {
    @Throws(IllegalArgumentException::class)
    fun execute(missionId: Int, source: MissionSourceEnum): CanDeleteMissionResponse {
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
