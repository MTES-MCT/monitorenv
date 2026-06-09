package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.controlUnits

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity

data class ControlUnitDataInput(
    val id: Int,
    val administration: String,
    val isArchived: Boolean,
    val name: String,
    val resources: List<ControlUnitResourceDataInput>,
    val contact: String? = null,
) {
    fun toLegacyControlUnit() =
        LegacyControlUnitEntity(
            id = id,
            administration = administration,
            isArchived = isArchived,
            name = name,
            resources = resources.map { it.toLegacyControlUnitResource() },
            contact = contact,
        )
}
