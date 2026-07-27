package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.controlUnits

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity

data class LegacyControlUnitDataInput(
    val id: Int,
    // TODO(16/06/2026): to remove ? useless as input since this obj is only used to map mission <-> control unit
    val administration: String,
    // TODO(16/06/2026): to remove ? useless as input since this obj is only used to map mission <-> control unit
    val isArchived: Boolean,
    // TODO(16/06/2026): to remove ? useless as input since this obj is only used to map mission <-> control unit
    val name: String,
    val resources: List<LegacyControlUnitResourceDataInput>,
    val contact: String? = null,
) {
    fun toControlUnitEntity() =
        ControlUnitEntity(
            id = id,
            administration = null,
            administrationId = null,
            contact = contact,
            isArchived = isArchived,
            name = name,
        )
}
