package fr.gouv.cacem.monitorenv.domain.use_cases.vessels.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.positions.AISPositionEntity
import fr.gouv.cacem.monitorenv.infrastructure.kafka.adapters.AISMessage
import fr.gouv.cacem.monitorenv.infrastructure.kafka.adapters.AISPayload
import fr.gouv.cacem.monitorenv.infrastructure.kafka.adapters.Feature
import java.time.ZonedDateTime

class AisPositionFixture {
    companion object {
        fun aPosition(
            mmsi: Int = 123456789,
            ts: ZonedDateTime = ZonedDateTime.now(),
        ) = AISPositionEntity(
            course = null,
            destination = null,
            geom = null,
            heading = null,
            id = 1,
            mmsi = mmsi,
            speed = null,
            status = null,
            timestamp = ts,
            shipname = null,
            sentAt = null,
        )

        fun aMessagePayload(
            mmsi: Int = 123456789,
            ts: ZonedDateTime = ZonedDateTime.now(),
        ) = AISPayload(
            course = null,
            features =
                Feature(
                    ais =
                        AISMessage(
                            imo = null,
                            callsign = null,
                            shipname = null,
                            shiptype = null,
                            toBow = null,
                            toStern = null,
                            toPort = null,
                            toStarboard = null,
                            draught = null,
                            destination = null,
                            ts = null,
                        ),
                ),
            coord = null,
            heading = null,
            mmsi = mmsi,
            speed = null,
            status = null,
            ts = ts,
        )
    }
}
