package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity

data class NearbyUnit(
    val controlUnit: LegacyControlUnitEntity,
    val missions: List<MissionEntity>,
)
