package fr.gouv.cacem.monitorenv.domain.use_cases.administration.dtos

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity

data class FullAdministrationDTO(
    val id: Int? = null,
    val controlUnitIds: List<Int>,
    val controlUnits: List<ControlUnitEntity>,
    val name: String,
)
