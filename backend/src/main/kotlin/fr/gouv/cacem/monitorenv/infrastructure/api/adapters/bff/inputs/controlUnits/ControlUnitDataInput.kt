package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.controlUnits

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity

data class ControlUnitDataInput(
    val id: Int,
    // TODO(16/06/2026): to remove ? useless as input since this obj is only used to map mission <-> control unit
    val administration: String,
    // TODO(16/06/2026): to remove ? useless as input since this obj is only used to map mission <-> control unit
    val isArchived: Boolean,
    // TODO(16/06/2026): to remove ? useless as input since this obj is only used to map mission <-> control unit
    val name: String,
    val resources: List<ControlUnitResourceDataInput>,
    val contact: String? = null,
) {
    fun toControlUnit() =
        ControlUnitEntity(
            id = id,
            administration = null,
            administrationId = null,
            isArchived = isArchived,
            name = name,
            contact = contact,
        )
}
