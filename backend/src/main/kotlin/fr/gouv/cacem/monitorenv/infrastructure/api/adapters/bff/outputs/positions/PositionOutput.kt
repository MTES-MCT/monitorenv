package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.positions

import fr.gouv.cacem.monitorenv.domain.entities.positions.AISPositionEntity
import org.locationtech.jts.geom.Point
import java.time.ZonedDateTime

data class PositionOutput(
    val course: Double?,
    val destination: String?,
    val geom: Point?,
    val heading: Double?,
    val id: Int?,
    val mmsi: Int?,
    val shipname: String?,
    val status: String?,
    val speed: Double?,
    val timestamp: ZonedDateTime?,
) {
    companion object {
        fun toLastPositionOutput(position: AISPositionEntity) =
            PositionOutput(
                course = position.course,
                destination = position.destination,
                geom = position.geom,
                heading = position.heading,
                id = position.id,
                mmsi = position.mmsi,
                shipname = position.shipname,
                status = position.status,
                speed = position.speed,
                timestamp = position.timestamp,
            )
    }
}
