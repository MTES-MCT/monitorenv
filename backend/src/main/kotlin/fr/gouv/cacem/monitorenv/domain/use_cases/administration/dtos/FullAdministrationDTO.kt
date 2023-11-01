package fr.gouv.cacem.monitorenv.domain.use_cases.administration.dtos

import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity

data class FullAdministrationDTO(
    val administration: AdministrationEntity,
    val controlUnits: List<ControlUnitEntity>
)
