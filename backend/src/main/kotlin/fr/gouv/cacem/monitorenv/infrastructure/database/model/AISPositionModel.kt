package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import fr.gouv.cacem.monitorenv.infrastructure.kafka.adapters.AISPositionEntity
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.locationtech.jts.geom.Geometry
import org.locationtech.jts.io.WKTReader
import org.n52.jackson.datatype.jts.GeometryDeserializer
import org.n52.jackson.datatype.jts.GeometrySerializer
import java.time.ZonedDateTime

@Entity
@Table(name = "ais_positions")
data class AISPositionModel(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int?,
    val mmsi: Int?,
    @JsonSerialize(using = GeometrySerializer::class)
    @JsonDeserialize(contentUsing = GeometryDeserializer::class)
    val coord: Geometry?,
    val status: String?,
    val course: Double?,
    val heading: Double?,
    val speed: Double?,
    val ts: ZonedDateTime?,
) {
    companion object {
        fun toAISPositionModel(aisPosition: AISPositionEntity): AISPositionModel =
            AISPositionModel(
                id = aisPosition.id,
                mmsi = aisPosition.mmsi,
                coord = aisPosition.coord.let { WKTReader().read(it) },
                status = aisPosition.status,
                course = aisPosition.course,
                speed = aisPosition.speed,
                heading = aisPosition.heading,
                ts = aisPosition.ts,
            )
    }
}
