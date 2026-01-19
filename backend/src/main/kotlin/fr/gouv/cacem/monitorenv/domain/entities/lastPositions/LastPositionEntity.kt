package fr.gouv.cacem.monitorenv.domain.entities.lastPositions

import org.locationtech.jts.geom.Point
import java.time.ZonedDateTime

data class LastPositionEntity(
    val course: Double?,
    val destination: String?,
    val geom: Point?,
    val heading: Double?,
    val id: Int,
    val mmsi: Int?,
    val status: String?,
    val speed: Double?,
    val shipname: String?,
    val timestamp: ZonedDateTime?,
)
