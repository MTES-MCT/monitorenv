@file:Suppress("ktlint:standard:package-name")

package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IMonitorFishMissionActionsRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO
import org.slf4j.LoggerFactory
import java.time.ZonedDateTime

@UseCase
class GetFullMissions(
    private val missionRepository: IMissionRepository,
    private val monitorFishMissionActionsRepository: IMonitorFishMissionActionsRepository,
) {
    private val logger = LoggerFactory.getLogger(GetFullMissions::class.java)
    fun execute(
        startedAfterDateTime: ZonedDateTime?,
        startedBeforeDateTime: ZonedDateTime?,
        missionSources: List<MissionSourceEnum>?,
        missionTypes: List<MissionTypeEnum>?,
        missionStatuses: List<String>?,
        pageNumber: Int?,
        pageSize: Int?,
        seaFronts: List<String>?,
    ): List<MissionDTO> {
        val missions =
            missionRepository.findAllFullMissions(
                startedAfter = startedAfterDateTime?.toInstant()
                    ?: ZonedDateTime.now().minusDays(30).toInstant(),
                startedBefore = startedBeforeDateTime?.toInstant(),
                missionTypes = missionTypes,
                missionStatuses = missionStatuses,
                missionSources = missionSources
                    ?: listOf(
                        MissionSourceEnum.MONITORENV,
                        MissionSourceEnum.MONITORFISH,
                    ),
                seaFronts = seaFronts,
                pageSize = pageSize,
                pageNumber = pageNumber,
            )

        logger.info("Found ${missions.size} mission(s)")

        return missions.map { missionAndFishActions ->
            val mission = missionAndFishActions.mission

            try {
                val fishActions =
                    monitorFishMissionActionsRepository.findFishMissionActionsById(mission.id!!)
                MissionDTO(mission = mission, fishActions = fishActions)
            } catch (e: Exception) {
                MissionDTO(mission = mission, fishActions = listOf())
            }
        }
    }
}
