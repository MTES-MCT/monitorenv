package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.base.BaseEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.base.dtos.FullBaseDTO

data class BaseDataOutput(
    val id: Int,
    val controlUnitResourceIds: List<Int>,
    val controlUnitResources: List<ControlUnitResourceEntity>? = null,
    val name: String,
) {
    companion object {
        fun fromBase(base: BaseEntity): BaseDataOutput {
            return BaseDataOutput(
                id = requireNotNull(base.id),
                controlUnitResourceIds = base.controlUnitResourceIds,
                name = base.name,
            )
        }

        fun fromFullBase(fullBase: FullBaseDTO): BaseDataOutput {
            return BaseDataOutput(
                id = requireNotNull(fullBase.id),
                controlUnitResourceIds = fullBase.controlUnitResourceIds,
                controlUnitResources = fullBase.controlUnitResources,
                name = fullBase.name,
            )
        }
    }
}
