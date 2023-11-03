package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitResourceEntity

data class LegacyControlUnitResourceDataOutput(
    val id: Int,
    val name: String
) {
    companion object {
        fun fromLegacyControlResourceEntity(
            legacyControlUnitResource: LegacyControlUnitResourceEntity
        ) =
            LegacyControlUnitResourceDataOutput(
                id = requireNotNull(legacyControlUnitResource.id),
                name = legacyControlUnitResource.name
            )
    }
}
