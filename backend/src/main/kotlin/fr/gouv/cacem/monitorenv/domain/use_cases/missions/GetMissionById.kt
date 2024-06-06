@file:Suppress("ktlint:standard:package-name")

package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IRapportNavMissionActionsRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO

@UseCase
class GetMissionById(
    private val missionRepository: IMissionRepository,
    private val rapportNavMissionActionsRepository: IRapportNavMissionActionsRepository,
) {
    fun execute(missionId: Int): MissionDTO {
        val mission = missionRepository.findFullMissionById(missionId)
        return try {
            val hasRapportNavActions = rapportNavMissionActionsRepository.findRapportNavMissionActionsById(missionId)

            mission.copy(hasRapportNavActions = hasRapportNavActions)
        } catch (e: Exception) {
            mission.copy(hasRapportNavActions = null)
        }
    }
}
