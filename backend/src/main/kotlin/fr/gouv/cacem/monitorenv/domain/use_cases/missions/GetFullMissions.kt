package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionsDTO
import org.slf4j.LoggerFactory
import java.time.ZonedDateTime

@UseCase
class GetFullMissions(
    private val missionRepository: IMissionRepository,
) {
    private val logger = LoggerFactory.getLogger(GetFullMissions::class.java)

    fun execute(
        startedAfterDateTime: ZonedDateTime?,
        startedBeforeDateTime: ZonedDateTime?,
        missionTypes: List<MissionTypeEnum>?,
        missionStatuses: List<String>?,
        pageNumber: Int?,
        pageSize: Int?,
        seaFronts: List<String>?,
        searchQuery: String?,
    ): List<MissionsDTO> {
        val missions =
            missionRepository.findAllFullMissions(
                startedAfter =
                    startedAfterDateTime?.toInstant()
                        ?: ZonedDateTime.now().minusDays(30).toInstant(),
                startedBefore = startedBeforeDateTime?.toInstant(),
                missionSources =
                    listOf(
                        MissionSourceEnum.MONITORENV,
                        MissionSourceEnum.MONITORFISH,
                    ),
                missionTypes = missionTypes,
                missionStatuses = missionStatuses,
                seaFronts = seaFronts,
                pageSize = pageSize,
                pageNumber = pageNumber,
                searchQuery = searchQuery,
            )

        logger.info("Found ${missions.size} full mission(s)")

        return missions
    }
}
