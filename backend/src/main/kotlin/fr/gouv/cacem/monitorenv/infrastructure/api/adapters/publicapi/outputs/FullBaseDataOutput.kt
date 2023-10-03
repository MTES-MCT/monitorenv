package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.use_cases.base.dtos.FullBaseDTO

data class FullBaseDataOutput(
    val id: Int,
    val controlUnitResourceIds: List<Int>,
    val controlUnitResources: List<ControlUnitResourceDataOutput>,
    val name: String,
) {
    companion object {
        fun fromFullBase(fullBase: FullBaseDTO): FullBaseDataOutput {
            val controlUnitResources =
                fullBase.controlUnitResources.map { ControlUnitResourceDataOutput.fromControlUnitResource(it) }

            return FullBaseDataOutput(
                id = requireNotNull(fullBase.base.id),
                controlUnitResourceIds = controlUnitResources.map { it.id },
                controlUnitResources,
                name = fullBase.base.name,
            )
        }
    }
}
