@file:Suppress("ktlint:standard:package-name")

package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import org.slf4j.LoggerFactory
import java.time.ZonedDateTime

@UseCase
class GetEngagedControlUnits(private val getFullMissions: GetFullMissions) {
    private val logger = LoggerFactory.getLogger(GetEngagedControlUnits::class.java)

    fun execute(): List<Pair<LegacyControlUnitEntity, List<MissionSourceEnum>>> {
        val openedMissions = getFullMissions.execute(
            startedAfterDateTime = ZonedDateTime.now().minusMonths(2),
            startedBeforeDateTime = null,
            missionSources = null,
            missionTypes = null,
            missionStatuses = listOf("PENDING"),
            pageNumber = null,
            pageSize = null,
            seaFronts = null,
        )

        val controlUnitsAndSource: List<Pair<LegacyControlUnitEntity, List<MissionSourceEnum>>> = openedMissions
            .flatMap {
                it.mission.controlUnits.map { controlUnit ->
                    Pair(controlUnit, it.mission.missionSource)
                }
            }.groupBy { it.first }
            .map { Pair(it.key, it.value.map { missionSource -> missionSource.second }) }


        logger.info("Found ${controlUnitsAndSource.size} engaged control unit(s).")

        return controlUnitsAndSource
    }
}
