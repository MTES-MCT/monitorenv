@file:Suppress("ktlint:standard:package-name")

package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import org.slf4j.LoggerFactory
import java.time.ZonedDateTime

@UseCase
class GetMissions(private val missionRepository: IMissionRepository) {
    private val logger = LoggerFactory.getLogger(GetMissions::class.java)

    fun execute(
        controlUnits: List<Int>? = null,
        missionStatuses: List<String>? = null,
        missionSources: List<MissionSourceEnum>? = null,
        missionTypes: List<String>? = null,
        pageNumber: Int? = null,
        pageSize: Int? = null,
        seaFronts: List<String>? = null,
        startedAfterDateTime: ZonedDateTime? = null,
        startedBeforeDateTime: ZonedDateTime? = null,
    ): List<MissionEntity> {
        var missions: List<MissionEntity> =
            missionRepository.findAll(
                startedAfter = startedAfterDateTime?.toInstant()
                    ?: ZonedDateTime.now().minusDays(30).toInstant(),
                startedBefore = startedBeforeDateTime?.toInstant(),
                missionSources = missionSources
                    ?: listOf(
                        MissionSourceEnum.MONITORENV,
                        MissionSourceEnum.MONITORFISH,
                    ),
                missionTypes = missionTypes,
                missionStatuses = missionStatuses,
                seaFronts = seaFronts,
                pageNumber = pageNumber,
                pageSize = pageSize,
            )

        if (!controlUnits.isNullOrEmpty()) {
            missions = missions.filter { mission ->
                controlUnits.any { unitId ->
                    mission.controlUnits.any { controlUnit ->
                        controlUnit.id == unitId
                    }
                }
            }.toList()
        }

        logger.info("Found ${missions.size} mission(s)")

        return missions
    }
}
