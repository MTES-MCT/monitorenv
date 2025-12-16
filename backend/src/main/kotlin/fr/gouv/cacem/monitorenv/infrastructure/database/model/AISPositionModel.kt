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

@Entity
@Table(name = "ais_positions")
data class AISPositionModel(
    @EmbeddedId
    val id: AISPositionPK,
    @JsonSerialize(using = GeometrySerializer::class)
    @JsonDeserialize(contentUsing = GeometryDeserializer::class)
    val coord: Geometry?,
    val status: String?,
    val course: Double?,
    val heading: Double?,
    val speed: Double?,
) {
    companion object {
        fun toAISPositionModel(aisPosition: AISPayload): AISPositionModel =
            AISPositionModel(
                id = AISPositionPK(mmsi = aisPosition.mmsi, ts = aisPosition.ts),
                coord = aisPosition.coord.let { WKTReader().read(it) },
                status = aisPosition.status,
                course = aisPosition.course,
                speed = aisPosition.speed,
                heading = aisPosition.heading,
            )
    }
}

@Embeddable
data class AISPositionPK(
    val ts: ZonedDateTime?,
    val mmsi: Int?,
) : Serializable
