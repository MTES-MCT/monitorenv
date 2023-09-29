package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos

import fr.gouv.cacem.monitorenv.domain.entities.base.BaseEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity

data class FullControlUnitResourceDTO(
    val base: BaseEntity,
    val controlUnit: ControlUnitEntity,
    val controlUnitResource: ControlUnitResourceEntity,
) {
    fun toControlUnitResource(): ControlUnitResourceEntity {
        return ControlUnitResourceEntity(
            id = controlUnitResource.id,
            baseId = controlUnitResource.baseId,
            controlUnitId = controlUnitResource.controlUnitId,
            name = controlUnitResource.name,
            note = controlUnitResource.note,
            photo = controlUnitResource.photo,
            type = controlUnitResource.type,
        )
    }
}
