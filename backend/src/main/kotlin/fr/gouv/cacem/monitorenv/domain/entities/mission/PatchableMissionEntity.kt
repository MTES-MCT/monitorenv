package fr.gouv.cacem.monitorenv.domain.entities.mission

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import java.time.ZonedDateTime
import java.util.Optional

data class PatchableMissionEntity(
    val controlUnits: List<ControlUnitEntity>?,
    val controlResources: List<ControlUnitResourceEntity>?,
    val endDateTimeUtc: Optional<ZonedDateTime>?,
    val missionTypes: List<MissionTypeEnum>?,
    val observationsByUnit: Optional<String>?,
    val startDateTimeUtc: ZonedDateTime?,
    val isUnderJdp: Boolean?,
)
