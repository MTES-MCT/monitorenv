@file:Suppress("ktlint:standard:package-name")

package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.ControlUnitToMissionSources
import org.slf4j.LoggerFactory
import java.time.ZonedDateTime

@UseCase
class GetEngagedControlUnits(private val getFullMissions: GetFullMissions) {
    private val logger = LoggerFactory.getLogger(GetEngagedControlUnits::class.java)

    fun execute(): List<ControlUnitToMissionSources> {
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

        val controlUnitToMissionSources = openedMissions.flatMap { mission ->
            mission.mission.controlUnits.map { controlUnit ->
                Pair(controlUnit, mission.mission.missionSource)
            }
        }
            .groupBy { it.first.id }
            .map { entry: Map.Entry<Int, List<Pair<LegacyControlUnitEntity, MissionSourceEnum>>> ->
                // As we grouped by controlUnit, all control units in Pair<LegacyControlUnitEntity, MissionSourceEnum> are equals
                val controlUnit = entry.value.first().first

                val missionSources = entry.value.map { it.second }.distinct()

                Pair(controlUnit, missionSources)
            }

        logger.info("Found ${controlUnitToMissionSources.size} engaged control unit(s).")

        return controlUnitToMissionSources
    }
}
