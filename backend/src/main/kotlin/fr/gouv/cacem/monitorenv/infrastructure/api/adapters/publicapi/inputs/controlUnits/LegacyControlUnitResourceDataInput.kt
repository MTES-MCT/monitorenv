package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.controlUnits

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceType
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitResourceEntity

data class LegacyControlUnitResourceDataInput(
    val id: Int,
    val controlUnitId: Int,
    val name: String,
    val type: ControlUnitResourceType,
) {
    fun toLegacyControlUnitResource() =
        LegacyControlUnitResourceEntity(
            id = id,
            controlUnitId = controlUnitId,
            name = name,
            type = type,
        )
}
