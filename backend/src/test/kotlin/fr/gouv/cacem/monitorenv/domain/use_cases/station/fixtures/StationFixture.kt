package fr.gouv.cacem.monitorenv.domain.use_cases.station.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.station.StationEntity

class StationFixture {
    companion object {
        fun aStationEntity() =
            StationEntity(
                id = 1,
                latitude = 34.0522,
                longitude = -118.2437,
                name = "Base 1",
            )
    }
}
