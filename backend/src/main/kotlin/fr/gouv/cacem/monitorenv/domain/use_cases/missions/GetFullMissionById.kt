@file:Suppress("ktlint:standard:package-name")

package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IMonitorFishMissionActionsRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO

@UseCase
class GetFullMissionById(
    private val missionRepository: IMissionRepository,
    private val monitorFishMissionActionsRepository: IMonitorFishMissionActionsRepository,
) {
    fun execute(missionId: Int): MissionDTO {
        val fullMission = missionRepository.findFullMissionById(missionId)

        val fishActions = monitorFishMissionActionsRepository.findFishMissionActionsById(missionId)
        return fullMission.copy(fishActions = fishActions)
    }
}
