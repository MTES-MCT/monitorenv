package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceType
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitResourceEntity

class ControlUnitResourceFixture {
    companion object {
        fun aLegacyControlUnitResource(): LegacyControlUnitResourceEntity =
            LegacyControlUnitResourceEntity(
                id = 1,
                controlUnitId = 0,
                name = "Control Unit Contact Name",
                type = ControlUnitResourceType.PATROL_BOAT,
            )

        fun aControlUnitResource(): ControlUnitResourceEntity =
            ControlUnitResourceEntity(
                id = 1,
                controlUnitId = 0,
                isArchived = false,
                name = "Control Unit Contact Name",
                type = ControlUnitResourceType.PATROL_BOAT,
                stationId = 1,
            )
    }
}
