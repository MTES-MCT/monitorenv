package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlResources.ControlResourceEntity

data class ControlResourceDataOutput(
    val id: Int,
    val name: String,
) {
    companion object {
        fun fromControlResourceEntity(controlResource: ControlResourceEntity) = ControlResourceDataOutput(
            id = controlResource.id,
            name = controlResource.name,
        )
    }
}
