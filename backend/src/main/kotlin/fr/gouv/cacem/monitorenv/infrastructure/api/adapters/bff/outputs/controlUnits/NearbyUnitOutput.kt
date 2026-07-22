package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.controlUnits

import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.NearbyUnit
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.missions.MissionDataOutput

data class NearbyUnitOutput(
    val controlUnit: LegacyControlUnitDataOutput,
    val missions: List<MissionDataOutput>,
) {
    companion object {
        fun fromNearbyUnit(nearbyUnit: NearbyUnit): NearbyUnitOutput =
            NearbyUnitOutput(
                controlUnit = LegacyControlUnitDataOutput.fromControlUnit(nearbyUnit.controlUnit, resources = listOf()),
                missions = nearbyUnit.missions.map { MissionDataOutput.fromMissionEntity(it) },
            )
    }
}
