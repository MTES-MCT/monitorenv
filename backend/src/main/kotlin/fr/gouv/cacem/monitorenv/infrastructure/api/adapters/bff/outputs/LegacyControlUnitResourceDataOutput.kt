package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitResourceEntity

data class LegacyControlUnitResourceDataOutput(
    val id: Int,
    val controlUnitId: Int,
    val name: String,
) {
    companion object {
        fun fromLegacyControlResourceEntity(legacyControlUnitResource: LegacyControlUnitResourceEntity) =
            LegacyControlUnitResourceDataOutput(
                id = requireNotNull(legacyControlUnitResource.id),
                controlUnitId = requireNotNull(legacyControlUnitResource.controlUnitId),
                name = legacyControlUnitResource.name,
            )
    }
}
