package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity

data class NearbyUnit(
    val controlUnit: ControlUnitEntity,
    val missions: List<MissionEntity>,
)
