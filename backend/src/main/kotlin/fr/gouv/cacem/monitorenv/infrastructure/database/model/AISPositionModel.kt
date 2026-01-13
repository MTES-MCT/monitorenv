package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import fr.gouv.cacem.monitorenv.infrastructure.kafka.adapters.AISPayload
import jakarta.persistence.Embeddable
import jakarta.persistence.EmbeddedId
import jakarta.persistence.Entity
import jakarta.persistence.Table
import org.locationtech.jts.geom.Geometry
import org.locationtech.jts.io.WKTReader
import org.n52.jackson.datatype.jts.GeometryDeserializer
import org.n52.jackson.datatype.jts.GeometrySerializer
import java.io.Serializable
import java.time.ZonedDateTime
import kotlin.math.roundToInt

@Entity
@Table(name = "ais_positions")
data class AISPositionModel(
    @EmbeddedId
    val id: AISPositionPK,
    @JsonSerialize(using = GeometrySerializer::class)
    @JsonDeserialize(contentUsing = GeometryDeserializer::class)
    val coord: Geometry?,
    val status: String?,
    val course: Short?,
    val heading: Short?,
    val speed: Short?,
) {
    companion object {
        fun toAISPositionModel(aisPosition: AISPayload): AISPositionModel =
            AISPositionModel(
                id = AISPositionPK(mmsi = aisPosition.mmsi, ts = aisPosition.ts),
                coord = aisPosition.coord.let { WKTReader().read(it) },
                status = aisPosition.status,
                course = aisPosition.course?.let { (it * 100).roundToInt().toShort() },
                speed = aisPosition.speed?.let { (it * 100).roundToInt().toShort() },
                heading = aisPosition.heading?.let { (it * 100).roundToInt().toShort() },
            )
    }
}

@Embeddable
data class AISPositionPK(
    val ts: ZonedDateTime?,
    val mmsi: Int?,
) : Serializable
