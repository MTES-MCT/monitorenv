package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.repositories.IMonitorFishMissionActionsRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IRapportNavMissionActionsRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDetailsDTO
import org.slf4j.LoggerFactory

@UseCase
class GetMissionAndSourceAction(
    private val getMission: GetMission,
    private val apiFishMissionActionsRepository: IMonitorFishMissionActionsRepository,
    private val apiRapportNavMissionActionsRepository: IRapportNavMissionActionsRepository,
) {
    private val logger = LoggerFactory.getLogger(GetFullMissionWithFishAndRapportNavActions::class.java)

    fun execute(
        missionId: Int,
        source: MissionSourceEnum?,
    ): MissionDetailsDTO {
        logger.info("GET mission $missionId and source action")
        getMission.execute(missionId).let {
            when (source) {
                MissionSourceEnum.MONITORFISH -> return MissionDetailsDTO(
                    it,
                    hasRapportNavActions =
                        apiRapportNavMissionActionsRepository.findRapportNavMissionActionsById(
                            missionId,
                        ),
                )

                MissionSourceEnum.RAPPORT_NAV -> return MissionDetailsDTO(
                    it,
                    fishActions = apiFishMissionActionsRepository.findFishMissionActionsById(missionId),
                )

                else -> return MissionDetailsDTO(it)
            }
        }
    }
}
