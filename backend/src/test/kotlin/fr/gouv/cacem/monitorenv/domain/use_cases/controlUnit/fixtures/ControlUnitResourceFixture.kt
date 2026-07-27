package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceType
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitResourceDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.fixtures.ControlUnitFixture.Companion.aControlUnit
import fr.gouv.cacem.monitorenv.domain.use_cases.station.fixtures.StationFixture.Companion.aStationEntity

class ControlUnitResourceFixture {
    companion object {
        fun aControlUnitResource(
            radioFrequency: String? = "radio",
            registrationId: String? = "12345E",
        ): ControlUnitResourceEntity =
            ControlUnitResourceEntity(
                id = 1,
                controlUnitId = 0,
                isArchived = false,
                name = "Control Unit Contact Name",
                type = ControlUnitResourceType.PATROL_BOAT,
                radioFrequency = radioFrequency,
                registrationId = registrationId,
                stationId = 1,
            )

        fun aFullControlUnitResourcesDTO(): FullControlUnitResourceDTO =
            FullControlUnitResourceDTO(
                controlUnit = aControlUnit(),
                controlUnitResource = aControlUnitResource(),
                station = aStationEntity(),
            )
    }
}
