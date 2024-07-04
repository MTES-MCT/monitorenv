package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IRapportNavMissionActionsRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO

@UseCase
class GetMissionWithRapportNavActions(
    private val getMission: GetMission,
    private val rapportNavMissionActionsRepository: IRapportNavMissionActionsRepository,
) {
    fun execute(missionId: Int): MissionDTO {
        getMission.execute(missionId).let {
            try {
                val hasRapportNavActions =
                    rapportNavMissionActionsRepository.findRapportNavMissionActionsById(missionId)

                return MissionDTO(mission = it, hasRapportNavActions = hasRapportNavActions)
            } catch (e: Exception) {
                return MissionDTO(mission = it)
            }
        }
    }
}
