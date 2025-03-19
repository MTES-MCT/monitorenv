@file:Suppress("ktlint:standard:package-name")

package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import org.slf4j.LoggerFactory
import java.time.ZonedDateTime

@UseCase
class GetMissions(
    private val missionRepository: IMissionRepository,
) {
    private val logger = LoggerFactory.getLogger(GetMissions::class.java)

    fun execute(
        controlUnitIds: List<Int>? = null,
        missionStatuses: List<String>? = null,
        missionSources: List<MissionSourceEnum>? = null,
        missionTypes: List<MissionTypeEnum>? = null,
        pageNumber: Int? = null,
        pageSize: Int? = null,
        seaFronts: List<String>? = null,
        startedAfterDateTime: ZonedDateTime? = null,
        startedBeforeDateTime: ZonedDateTime? = null,
        searchQuery: String? = null,
    ): List<MissionEntity> {
        logger.info("Attempt to GET all missions")

        val missions: List<MissionEntity> =
            missionRepository.findAll(
                controlUnitIds = controlUnitIds,
                missionSources =
                    missionSources
                        ?: listOf(
                            MissionSourceEnum.MONITORENV,
                            MissionSourceEnum.MONITORFISH,
                        ),
                missionStatuses = missionStatuses,
                missionTypes = missionTypes,
                pageNumber = pageNumber,
                pageSize = pageSize,
                seaFronts = seaFronts,
                startedAfter =
                    startedAfterDateTime?.toInstant()
                        ?: ZonedDateTime.now().minusDays(30).toInstant(),
                startedBefore = startedBeforeDateTime?.toInstant(),
                searchQuery = searchQuery,
            )

        logger.info("Found ${missions.size} missions")

        return missions
    }
}
