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
    fun execute(missionId: Int): Pair<Boolean, MissionDTO> {
        val fullMission = missionRepository.findFullMissionById(missionId)

        return try {
            val fishActions = monitorFishMissionActionsRepository.findFishMissionActionsById(missionId)

            Pair(true, fullMission.copy(fishActions = fishActions))
        } catch (e: Exception) {
            Pair(false, fullMission.copy(fishActions = listOf()))
        }
    }
}
