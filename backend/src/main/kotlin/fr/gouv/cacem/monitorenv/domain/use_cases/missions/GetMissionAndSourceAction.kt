package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO
import fr.gouv.cacem.monitorenv.infrastructure.monitorfish.APIFishMissionActionsRepository
import fr.gouv.cacem.monitorenv.infrastructure.rapportnav.APIRapportNavMissionActionsRepository

@UseCase
class GetMissionAndSourceAction(
    private val getMission: GetMission,
    private val apiFishMissionActionsRepository: APIFishMissionActionsRepository,
    private val apiRapportNavMissionActionsRepository: APIRapportNavMissionActionsRepository,
) {
    fun execute(missionId: Int, source: MissionSourceEnum?): MissionDTO {
        getMission.execute(missionId).let {
            when (source) {
                MissionSourceEnum.RAPPORT_NAV -> return MissionDTO(
                    it,
                    hasRapportNavActions = apiRapportNavMissionActionsRepository.findRapportNavMissionActionsById(
                        missionId,
                    ),
                )

                MissionSourceEnum.MONITORFISH -> return MissionDTO(
                    it,
                    fishActions = apiFishMissionActionsRepository.findFishMissionActionsById(missionId),
                )

                else -> return MissionDTO(it)
            }
        }
    }
}
