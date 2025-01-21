package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IMonitorFishMissionActionsRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IRapportNavMissionActionsRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDetailsDTO
import org.slf4j.LoggerFactory

@UseCase
class GetFullMissionWithFishAndRapportNavActions(
    private val getFullMission: GetFullMission,
    private val monitorFishMissionActionsRepository: IMonitorFishMissionActionsRepository,
    private val rapportNavMissionActionsRepository: IRapportNavMissionActionsRepository,
) {
    private val logger = LoggerFactory.getLogger(GetFullMissionWithFishAndRapportNavActions::class.java)

    fun execute(missionId: Int): Pair<Boolean, MissionDetailsDTO> {
        logger.info("GET full mission $missionId with fish and rapport nav action")
        getFullMission.execute(missionId).let {
            try {
                val fishActions = monitorFishMissionActionsRepository.findFishMissionActionsById(missionId)

                val hasRapportNavActions =
                    rapportNavMissionActionsRepository.findRapportNavMissionActionsById(missionId)

                return Pair(true, it.copy(fishActions = fishActions, hasRapportNavActions = hasRapportNavActions))
            } catch (e: Exception) {
                return Pair(false, it.copy(fishActions = listOf(), hasRapportNavActions = null))
            }
        }
    }
}
