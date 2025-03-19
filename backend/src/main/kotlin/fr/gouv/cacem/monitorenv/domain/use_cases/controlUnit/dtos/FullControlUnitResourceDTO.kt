package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.station.StationEntity

data class FullControlUnitResourceDTO(
    val controlUnit: ControlUnitEntity,
    val controlUnitResource: ControlUnitResourceEntity,
    val station: StationEntity,
) {
    fun toLegacyControlUnitResource(): LegacyControlUnitResourceEntity =
        LegacyControlUnitResourceEntity(
            id = requireNotNull(controlUnitResource.id),
            controlUnitId = requireNotNull(controlUnit.id),
            name = controlUnitResource.name,
        )
}
