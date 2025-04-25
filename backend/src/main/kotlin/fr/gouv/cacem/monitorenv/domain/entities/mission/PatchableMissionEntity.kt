package fr.gouv.cacem.monitorenv.domain.entities.mission

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import java.time.ZonedDateTime
import java.util.*

data class PatchableMissionEntity(
    val controlUnits: List<LegacyControlUnitEntity>?,
    val endDateTimeUtc: Optional<ZonedDateTime>?,
    val missionTypes: List<MissionTypeEnum>?,
    val observationsByUnit: Optional<String>?,
    val startDateTimeUtc: ZonedDateTime?,
    val isUnderJdp: Boolean?,
)
