@file:Suppress("ktlint:standard:package-name")

package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import org.slf4j.LoggerFactory
import java.time.ZonedDateTime

@UseCase
class GetEngagedControlUnits(private val getFullMissions: GetFullMissions) {
    private val logger = LoggerFactory.getLogger(GetEngagedControlUnits::class.java)

    fun execute(): List<LegacyControlUnitEntity> {
        val openedMissions =
            getFullMissions.execute(
                startedAfterDateTime = ZonedDateTime.now().minusMonths(2),
                startedBeforeDateTime = null,
                missionSources = null,
                missionTypes = null,
                missionStatuses = listOf("PENDING"),
                pageNumber = null,
                pageSize = null,
                seaFronts = null,
            )

        val controlUnits =
            openedMissions.map { it.mission.controlUnits }.flatten().distinctBy { it.id }

        logger.info("Found ${controlUnits.size} engaged control unit(s).")

        return controlUnits
    }
}
