package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.controlUnits

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceType
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitResourceEntity

data class ControlUnitResourceDataInput(
    val id: Int,
    val controlUnitId: Int,
    val name: String,
    val type: ControlUnitResourceType,
) {
    fun toLegacyControlUnitResource() =
        LegacyControlUnitResourceEntity(
            id = id,
            name = name,
            controlUnitId = controlUnitId,
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
