package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.base.BaseEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.base.dtos.FullBaseDTO
import fr.gouv.cacem.monitorenv.utils.requireNonNull

data class BaseDataOutput(
    val id: Int,
    val controlUnitIds: List<Int>,
    val controlUnitResources: List<ControlUnitResourceEntity>? = null,
    val name: String,
) {
    companion object {
        fun fromBase(
            base: BaseEntity
        ): BaseDataOutput {
            return BaseDataOutput(
                id = requireNonNull(base.id),
                controlUnitIds = base.controlUnitResourceIds,
                name = base.name,
            )
        }

        fun fromFullBase(
            fullBaseDTO: FullBaseDTO
        ): BaseDataOutput {
            return BaseDataOutput(
                id = requireNonNull(fullBaseDTO.id),
                controlUnitIds = fullBaseDTO.controlUnitResourceIds,
                controlUnitResources = fullBaseDTO.controlUnitResources,
                name = fullBaseDTO.name,
            )
        }
    }
}
