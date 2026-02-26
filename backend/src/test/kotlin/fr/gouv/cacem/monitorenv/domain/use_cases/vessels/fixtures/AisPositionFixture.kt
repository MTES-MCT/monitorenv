package fr.gouv.cacem.monitorenv.domain.use_cases.vessels.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.positions.AISPositionEntity

class AisPositionFixture {
    companion object {
        fun aPosition() =
            AISPositionEntity(
                course = null,
                destination = null,
                geom = null,
                heading = null,
                id = 1,
                mmsi = null,
                speed = null,
                status = null,
                timestamp = null,
                shipname = null,
            )
    }
}
