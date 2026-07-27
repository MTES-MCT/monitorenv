package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.controlUnits

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceType

data class ControlUnitResourceDataInput(
    val id: Int,
    val controlUnitId: Int,
    val name: String,
    val type: ControlUnitResourceType,
) {
    fun toControlUnitResource() =
        ControlUnitResourceEntity(
            id = id,
            controlUnitId = controlUnitId,
            name = name,
            type = type,
            isArchived = false,
            note = null,
            photo = null,
            radioFrequency = null,
            registrationId = null,
            stationId = null,
        )
}
