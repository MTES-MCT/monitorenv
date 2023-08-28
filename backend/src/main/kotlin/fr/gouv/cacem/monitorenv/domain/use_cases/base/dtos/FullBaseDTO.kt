package fr.gouv.cacem.monitorenv.domain.use_cases.base.dtos

import fr.gouv.cacem.monitorenv.domain.entities.base.BaseEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity

data class FullBaseDTO(
    val id: Int? = null,
    val controlUnitResourceIds: List<Int>,
    val controlUnitResources: List<ControlUnitResourceEntity>,
    val name: String,
) {
    fun toBase(): BaseEntity {
        return BaseEntity(
            id,
            controlUnitResourceIds,
            name,
        )
    }
}
