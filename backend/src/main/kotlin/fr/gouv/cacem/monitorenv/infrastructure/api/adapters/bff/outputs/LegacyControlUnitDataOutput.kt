package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity

data class LegacyControlUnitDataOutput(
    val id: Int,
    val administration: String,
    val isArchived: Boolean,
    val name: String,
    val resources: List<LegacyControlResourceDataOutput>,
) {
    companion object {
        fun fromLegacyControlUnit(controlUnit: LegacyControlUnitEntity) = LegacyControlUnitDataOutput(
            id = controlUnit.id,
            administration = controlUnit.administration,
            name = controlUnit.name,
            isArchived = controlUnit.isArchived,
            resources = controlUnit.resources.map {
                LegacyControlResourceDataOutput.fromControlResourceEntity(it)
            },
        )
    }
}
