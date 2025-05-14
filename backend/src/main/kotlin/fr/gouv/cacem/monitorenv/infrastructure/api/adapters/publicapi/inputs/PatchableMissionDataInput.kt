package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.PatchableMissionEntity
import java.time.ZonedDateTime
import java.util.*

data class PatchableMissionDataInput(
    val controlUnits: List<LegacyControlUnitEntity>?,
    val endDateTimeUtc: Optional<ZonedDateTime>?,
    val missionTypes: MutableList<MissionTypeEnum>?,
    val observationsByUnit: Optional<String>?,
    val startDateTimeUtc: ZonedDateTime?,
    val isUnderJdp: Boolean?,
) {
    fun toPatchableMissionEntity(): PatchableMissionEntity =
        PatchableMissionEntity(
            controlUnits = controlUnits,
            endDateTimeUtc = endDateTimeUtc,
            missionTypes = missionTypes,
            observationsByUnit = observationsByUnit,
            startDateTimeUtc = startDateTimeUtc,
            isUnderJdp = isUnderJdp,
        )
}
