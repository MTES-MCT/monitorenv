package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.missions

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.PatchableMissionEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.controlUnits.LegacyControlUnitDataInput
import java.time.ZonedDateTime
import java.util.Optional

data class PatchableMissionDataInput(
    val controlUnits: List<LegacyControlUnitDataInput>?,
    val endDateTimeUtc: Optional<ZonedDateTime>?,
    val missionTypes: MutableList<MissionTypeEnum>?,
    val observationsByUnit: Optional<String>?,
    val startDateTimeUtc: ZonedDateTime?,
    val isUnderJdp: Boolean?,
) {
    fun toPatchableMissionEntity(): PatchableMissionEntity =
        PatchableMissionEntity(
            controlUnits = controlUnits?.map { it.toControlUnitEntity() },
            controlResources =
                controlUnits
                    ?.flatMap { controlUnit -> controlUnit.resources }
                    ?.map { it.toControlUnitResource() },
            endDateTimeUtc = endDateTimeUtc,
            missionTypes = missionTypes,
            observationsByUnit = observationsByUnit,
            startDateTimeUtc = startDateTimeUtc,
            isUnderJdp = isUnderJdp,
        )
}
