package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity

data class FullControlUnitContactDTO(
    val controlUnit: ControlUnitEntity,
    val controlUnitContact: ControlUnitContactEntity
)
