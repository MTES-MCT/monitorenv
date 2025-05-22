package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.controlUnits

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.NearbyUnit
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.missions.MissionDataOutput

data class NearbyUnitOutput(
    val controlUnit: LegacyControlUnitEntity,
    val missions: List<MissionDataOutput>,
) {
    companion object {
        fun fromNearbyUnit(nearbyUnit: NearbyUnit): NearbyUnitOutput =
            NearbyUnitOutput(
                controlUnit = nearbyUnit.controlUnit,
                missions = nearbyUnit.missions.map { MissionDataOutput.fromMissionEntity(it) },
            )
    }
}
