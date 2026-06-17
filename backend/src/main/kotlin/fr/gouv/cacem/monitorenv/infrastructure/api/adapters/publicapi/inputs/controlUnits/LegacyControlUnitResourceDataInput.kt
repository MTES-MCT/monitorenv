package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.controlUnits

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceType
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitResourceEntity

data class LegacyControlUnitResourceDataInput(
    val id: Int,
    val controlUnitId: Int,
    // TODO(16/06/2026): to remove ? useless as input since this obj is only used to map mission <-> control unit
    val name: String,
    // TODO(16/06/2026): to remove ? useless as input since this obj is only used to map mission <-> control unit
    val type: ControlUnitResourceType,
) {
    fun toLegacyControlUnitResource() =
        LegacyControlUnitResourceEntity(
            id = id,
            controlUnitId = controlUnitId,
            name = name,
            type = type,
        )

    fun toControlUnitResource() =
        ControlUnitResourceEntity(
            id = id,
            controlUnitId = controlUnitId,
            name = name,
            type = type,
            isArchived = false,
            note = null,
            photo = null,
            // TODO: ???
            stationId = 1,
        )
}
