package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.controlUnits

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceType
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitResourceEntity

data class LegacyControlUnitResourceDataOutput(
    val id: Int,
    val controlUnitId: Int,
    val name: String,
    val type: ControlUnitResourceType,
) {
    companion object {
        fun fromLegacyControlResourceEntity(legacyControlUnitResource: LegacyControlUnitResourceEntity) =
            LegacyControlUnitResourceDataOutput(
                id = requireNotNull(legacyControlUnitResource.id),
                controlUnitId = requireNotNull(legacyControlUnitResource.controlUnitId),
                name = legacyControlUnitResource.name,
                type = legacyControlUnitResource.type,
            )
    }
}
