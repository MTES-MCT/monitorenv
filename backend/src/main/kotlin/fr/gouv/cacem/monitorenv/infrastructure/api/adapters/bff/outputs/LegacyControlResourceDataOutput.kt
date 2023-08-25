package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlResourceEntity

data class LegacyControlResourceDataOutput(
    val id: Int,
    val name: String,
) {
    companion object {
        fun fromControlResourceEntity(controlResource: LegacyControlResourceEntity) = LegacyControlResourceDataOutput(
            id = controlResource.id,
            name = controlResource.name,
        )
    }
}
