package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.infrastructure.kafka.adapters.AISPayload
import jakarta.persistence.Embeddable
import jakarta.persistence.EmbeddedId
import jakarta.persistence.Entity
import jakarta.persistence.Table
import org.locationtech.jts.geom.Geometry
import org.locationtech.jts.io.WKTReader
import org.n52.jackson.datatype.jts.GeometryDeserializer
import org.n52.jackson.datatype.jts.GeometrySerializer
import tools.jackson.databind.annotation.JsonDeserialize
import tools.jackson.databind.annotation.JsonSerialize
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
    val imo: String?,
    val callsign: String?,
    val shipname: String?,
    val shiptype: Int?,
    val toBow: Short?,
    val toStern: Short?,
    val toPort: Short?,
    val toStarboard: Short?,
    val draught: Short?,
    val destination: String?,
) {
    companion object {
        fun toAISPositionModel(aisPosition: AISPayload): AISPositionModel =
            AISPositionModel(
                id = AISPositionPK(mmsi = aisPosition.mmsi, ts = aisPosition.features?.ais?.ts),
                coord = aisPosition.coord.let { WKTReader().read(it) },
                status = aisPosition.status,
                course = aisPosition.course?.let(toShort()),
                speed = aisPosition.speed?.let(toShort()),
                heading = aisPosition.heading?.let(toShort()),
                imo = aisPosition.features?.ais?.imo,
                callsign = aisPosition.features?.ais?.callsign,
                shipname = aisPosition.features?.ais?.shipname,
                shiptype = aisPosition.features?.ais?.shiptype,
                toBow =
                    aisPosition.features
                        ?.ais
                        ?.toBow
                        ?.let(toShort()),
                toStern =
                    aisPosition.features
                        ?.ais
                        ?.toStern
                        ?.let(toShort()),
                toPort =
                    aisPosition.features
                        ?.ais
                        ?.toPort
                        ?.let(toShort()),
                toStarboard =
                    aisPosition.features
                        ?.ais
                        ?.toStarboard
                        ?.let(toShort()),
                draught =
                    aisPosition.features
                        ?.ais
                        ?.draught
                        ?.let(toShort()),
                destination = aisPosition.features?.ais?.destination,
            )

        private fun toShort(): (Double) -> Short = { (it * 100).roundToInt().toShort() }
    }
}

@Embeddable
data class AISPositionPK(
    val ts: ZonedDateTime?,
    val mmsi: Int?,
) : Serializable
