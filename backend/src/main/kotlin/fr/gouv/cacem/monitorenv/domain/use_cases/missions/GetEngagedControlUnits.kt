@file:Suppress("ktlint:standard:package-name")

package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
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

        val controlUnitsIdsAndMissionSources = openedMissions
            .flatMap {
                // We flatten (and duplicate) the control unit key
                it.mission.controlUnits.map { controlUnit ->
                    logger.info("DBG ${controlUnit.id} - ${controlUnit.name}")
                    Pair(controlUnit, it.mission.missionSource)
                }
            }

        val groupedControlUnitsIdsAndMissionSources = controlUnitsIdsAndMissionSources
            // We group by control unit id, to de-duplicate
            .groupBy { it.first.id }
            .map { entry ->
                Pair(entry.key, entry.value.map { it.second }.distinct())
            }

        val groupedControlUnitsAndMissionSources = groupedControlUnitsIdsAndMissionSources.map { entry ->
            val controlUnit = controlUnitsIdsAndMissionSources
                .first { controlUnit -> controlUnit.first.id == entry.first }.first

            Pair(controlUnit, entry.second)
        }

        logger.info("Found ${groupedControlUnitsAndMissionSources.size} engaged control unit(s).")

        return groupedControlUnitsAndMissionSources
    }
}
