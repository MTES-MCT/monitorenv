package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity

data class LegacyControlUnitResourceDataOutput(
    val id: Int,
    val name: String,
) {
    companion object {
        fun fromControlResourceEntity(controlUnitResource: ControlUnitResourceEntity) =
            LegacyControlUnitResourceDataOutput(
                id = requireNotNull(controlUnitResource.id),
                name = controlUnitResource.name,
            )
    }
}
