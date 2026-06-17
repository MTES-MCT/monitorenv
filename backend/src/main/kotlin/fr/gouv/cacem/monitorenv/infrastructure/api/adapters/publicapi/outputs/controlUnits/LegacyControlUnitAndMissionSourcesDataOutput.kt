package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.controlUnits

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.controlUnits.LegacyControlUnitDataOutput

data class LegacyControlUnitAndMissionSourcesDataOutput(
    val controlUnit: LegacyControlUnitDataOutput,
    val missionSources: List<MissionSourceEnum>,
) {
    companion object {
        fun fromLegacyControlUnitAndMissionSources(pair: Pair<ControlUnitEntity, List<MissionSourceEnum>>) =
            LegacyControlUnitAndMissionSourcesDataOutput(
                controlUnit = LegacyControlUnitDataOutput.fromControlUnit(pair.first, emptyList()),
                missionSources = pair.second,
            )
    }
}
