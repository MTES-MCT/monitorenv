package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IRapportNavMissionActionsRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDetailsDTO
import org.slf4j.LoggerFactory

@UseCase
class GetMissionWithRapportNavActions(
    private val getMission: GetMission,
    private val rapportNavMissionActionsRepository: IRapportNavMissionActionsRepository,
) {
    private val logger = LoggerFactory.getLogger(GetFullMissionWithFishAndRapportNavActions::class.java)

    fun execute(missionId: Int): MissionDetailsDTO {
        logger.info("GET mission $missionId with rapportNavActions")
        getMission.execute(missionId).let {
            try {
                val hasRapportNavActions =
                    rapportNavMissionActionsRepository.findRapportNavMissionActionsById(missionId)

                return MissionDetailsDTO(mission = it, hasRapportNavActions = hasRapportNavActions)
            } catch (e: Exception) {
                return MissionDetailsDTO(mission = it)
            }
        }
    }
}
