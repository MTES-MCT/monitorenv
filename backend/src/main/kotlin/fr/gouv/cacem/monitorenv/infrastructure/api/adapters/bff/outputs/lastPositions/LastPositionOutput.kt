package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.lastPositions

import fr.gouv.cacem.monitorenv.domain.entities.lastPositions.LastPositionEntity
import org.locationtech.jts.geom.Point
import java.time.ZonedDateTime

data class LastPositionOutput(
    val course: Double?,
    val destination: String?,
    val geom: Point?,
    val heading: Double?,
    val id: Int,
    val mmsi: Int?,
    val shipname: String?,
    val status: String?,
    val speed: Double?,
    val timestamp: ZonedDateTime?,
) {
    companion object {
        fun toLastPositionOutput(lastPosition: LastPositionEntity) =
            LastPositionOutput(
                course = lastPosition.course,
                destination = lastPosition.destination,
                geom = lastPosition.geom,
                heading = lastPosition.heading,
                id = lastPosition.id,
                mmsi = lastPosition.mmsi,
                shipname = lastPosition.shipname,
                status = lastPosition.status,
                speed = lastPosition.speed,
                timestamp = lastPosition.timestamp,
            )
    }
}
