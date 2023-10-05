package fr.gouv.cacem.monitorenv.domain.use_cases.missions // ktlint-disable package-name

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import org.slf4j.LoggerFactory
import java.time.ZonedDateTime

@UseCase
class GetControlUnitsInvolvedInMissions(private val getMissions: GetMissions) {
    private val logger = LoggerFactory.getLogger(GetControlUnitsInvolvedInMissions::class.java)

    fun execute(): List<LegacyControlUnitEntity> {
        val openedMissions = getMissions.execute(
            startedAfterDateTime = ZonedDateTime.now().minusMonths(2),
            startedBeforeDateTime = null,
            missionSources = null,
            missionTypes = null,
            missionStatuses = listOf("PENDING"),
            pageNumber = null,
            pageSize = null,
            seaFronts = null,
        )

        val controlUnits = openedMissions
            .map { it.controlUnits }
            .flatten()
            .distinctBy { it.id }

        logger.info("Found ${controlUnits.size} control unit(s) involved in a mission.")

        return controlUnits
    }
}
