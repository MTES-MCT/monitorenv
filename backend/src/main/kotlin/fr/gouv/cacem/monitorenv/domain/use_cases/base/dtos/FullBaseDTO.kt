package fr.gouv.cacem.monitorenv.domain.use_cases.base.dtos

import fr.gouv.cacem.monitorenv.domain.entities.base.BaseEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity

data class FullBaseDTO(
    val base: BaseEntity,
    val controlUnitResources: List<ControlUnitResourceEntity>
)
