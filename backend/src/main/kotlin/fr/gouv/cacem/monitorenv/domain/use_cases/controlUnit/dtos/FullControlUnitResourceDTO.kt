package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos

import fr.gouv.cacem.monitorenv.domain.entities.base.BaseEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitResourceEntity

data class FullControlUnitResourceDTO(
    val base: BaseEntity,
    val controlUnit: ControlUnitEntity,
    val controlUnitResource: ControlUnitResourceEntity,
) {
    fun toLegacyControlUnitResource(): LegacyControlUnitResourceEntity {
        return LegacyControlUnitResourceEntity(
            id = requireNotNull(controlUnitResource.id),
            name = controlUnitResource.name,
        )
    }
}
