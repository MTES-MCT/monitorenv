package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum

data class LegacyControlUnitAndMissionSourcesDataOutput(
    val controlUnit: LegacyControlUnitDataOutput,
    val missionSources: List<MissionSourceEnum>,
) {
    companion object {
        fun fromLegacyControlUnitAndMissionSources(pair: Pair<LegacyControlUnitEntity, List<MissionSourceEnum>>) =
            LegacyControlUnitAndMissionSourcesDataOutput (
                controlUnit = LegacyControlUnitDataOutput.fromLegacyControlUnit(pair.first),
                missionSources = pair.second
            )
    }
}
