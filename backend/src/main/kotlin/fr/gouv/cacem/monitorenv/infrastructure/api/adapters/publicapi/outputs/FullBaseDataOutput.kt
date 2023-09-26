package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.base.dtos.FullBaseDTO

data class FullBaseDataOutput(
    val id: Int,
    val controlUnitResourceIds: List<Int>,
    val controlUnitResources: List<ControlUnitResourceEntity>,
    val name: String,
) {
    companion object {
        fun fromFullBase(fullBase: FullBaseDTO): FullBaseDataOutput {
            return FullBaseDataOutput(
                id = requireNotNull(fullBase.id),
                controlUnitResourceIds = fullBase.controlUnitResourceIds,
                controlUnitResources = fullBase.controlUnitResources,
                name = fullBase.name,
            )
        }
    }
}
