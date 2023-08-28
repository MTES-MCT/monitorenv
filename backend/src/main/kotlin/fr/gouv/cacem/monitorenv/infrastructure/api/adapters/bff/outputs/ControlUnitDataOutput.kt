package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlResource.ControlUnitEntity

data class ControlUnitDataOutput(
    val id: Int,
    val administration: String,
    val isArchived: Boolean,
    val name: String,
    val resources: List<ControlResourceDataOutput>,
) {
    companion object {
        fun fromControlUnitEntity(controlUnit: ControlUnitEntity) = ControlUnitDataOutput(
            id = controlUnit.id,
            administration = controlUnit.administration,
            name = controlUnit.name,
            isArchived = controlUnit.isArchived,
            resources = controlUnit.resources.map {
                ControlResourceDataOutput.fromControlResourceEntity(it)
            },
        )
    }
}
