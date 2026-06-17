package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.controlUnits

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity

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
    @Deprecated(message = "TO REMOVE", level = DeprecationLevel.ERROR)
    fun toLegacyControlUnit() =
        LegacyControlUnitEntity(
            id = id,
            administration = administration,
            isArchived = isArchived,
            name = name,
            resources = resources.map { it.toLegacyControlUnitResource() },
            contact = contact,
        )

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
