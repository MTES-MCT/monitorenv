package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.lastPositions.LastPositionEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.locationtech.jts.geom.Point
import java.time.ZonedDateTime

@Entity
@Table(name = "last_positions")
data class LastPositionModel(
    val course: Short?,
    val destination: String?,
    @Id
    val id: Int,
    @Column(name = "coord")
    val geom: Point?,
    val heading: Short?,
    val mmsi: Int?,
    @Column(name = "vessel_id")
    val shipId: Int,
    val shipname: String?,
    val speed: Short?,
    val status: String?,
    @Column(name = "ts")
    val timestamp: ZonedDateTime?,
) {
    fun toLastPosition(): LastPositionEntity =
        LastPositionEntity(
            course = course?.let(toDouble()),
            destination = destination,
            id = id,
            geom = geom,
            heading = heading?.let(toDouble()),
            mmsi = mmsi,
            shipname = shipname,
            status = status,
            speed = speed?.let(toDouble()),
            timestamp = timestamp,
        )

    companion object {
        private fun toDouble(): (Short) -> Double = { (it.toDouble() / 100) }
    }
}
