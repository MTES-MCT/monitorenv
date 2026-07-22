package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.controlUnits

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceType
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitResourceEntity

data class LegacyControlUnitResourceDataOutput(
    val id: Int,
    val controlUnitId: Int,
    val name: String,
    val type: ControlUnitResourceType,
) {
    companion object {
        fun fromLegagcyControlResource(resource: LegacyControlUnitResourceEntity) =
            LegacyControlUnitResourceDataOutput(
                id = resource.id,
                name = resource.name,
                controlUnitId = resource.controlUnitId,
                type = resource.type,
            )

        fun fromControlResourceEntity(controlUnitResource: ControlUnitResourceEntity) =
            LegacyControlUnitResourceDataOutput(
                id = requireNotNull(controlUnitResource.id),
                controlUnitId = requireNotNull(controlUnitResource.controlUnitId),
                name = controlUnitResource.name,
                type = controlUnitResource.type,
            )
    }
}
