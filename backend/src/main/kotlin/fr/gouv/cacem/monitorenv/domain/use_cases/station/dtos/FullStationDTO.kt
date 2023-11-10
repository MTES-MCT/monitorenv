package fr.gouv.cacem.monitorenv.domain.use_cases.station.dtos

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.station.StationEntity

data class FullStationDTO(
    val controlUnitResources: List<ControlUnitResourceEntity>,
    val station: StationEntity,
)
