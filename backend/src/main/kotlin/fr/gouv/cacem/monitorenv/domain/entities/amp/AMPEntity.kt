package fr.gouv.cacem.monitorenv.domain.entities.amp

import org.locationtech.jts.geom.MultiPolygon
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter

data class AMPEntity(
    val id: Int,
    val designation: String,
    val geom: MultiPolygon?,
    val name: String,
    val refReg: String? = null,
    val type: String? = null,
    val updatedAt: String? = null,
    val urlLegicem: String? = null,
) {
    fun isNew(): Boolean {
        val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
        val formattedUpdatedAt =
            updatedAt?.let {
                LocalDateTime.parse(it, formatter).atZone(ZoneId.of("Europe/Paris"))
            }

        return formattedUpdatedAt != null &&
            formattedUpdatedAt
                .isAfter(
                    ZonedDateTime.now().minusDays(30),
                )
    }
}
