package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity

data class LegacyControlUnitDataOutput(
    val id: Int,
    val administration: String,
    val isArchived: Boolean,
    val name: String,
    val resources: List<LegacyControlUnitResourceDataOutput>,
) {
    companion object {
        fun fromLegacyControlUnit(legacyControlUnit: LegacyControlUnitEntity) = LegacyControlUnitDataOutput(
            id = legacyControlUnit.id,
            administration = legacyControlUnit.administration,
            name = legacyControlUnit.name,
            isArchived = legacyControlUnit.isArchived,
            resources = legacyControlUnit.resources.map {
                LegacyControlUnitResourceDataOutput.fromControlResourceEntity(it)
            },
        )
    }
}
