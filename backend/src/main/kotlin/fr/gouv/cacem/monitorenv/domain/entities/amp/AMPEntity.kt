package fr.gouv.cacem.monitorenv.domain.entities.amp

import org.locationtech.jts.geom.MultiPolygon
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter

data class AMPEntity(
    val id: Int,
    val designation: String,
    val extent: DoubleArray? = null,
    val geom: MultiPolygon,
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

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as AMPEntity

        if (id != other.id) return false
        if (designation != other.designation) return false
        if (!extent.contentEquals(other.extent)) return false
        if (geom != other.geom) return false
        if (name != other.name) return false
        if (refReg != other.refReg) return false
        if (type != other.type) return false
        if (updatedAt != other.updatedAt) return false
        if (urlLegicem != other.urlLegicem) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id
        result = 31 * result + designation.hashCode()
        result = 31 * result + (extent?.contentHashCode() ?: 0)
        result = 31 * result + geom.hashCode()
        result = 31 * result + name.hashCode()
        result = 31 * result + (refReg?.hashCode() ?: 0)
        result = 31 * result + (type?.hashCode() ?: 0)
        result = 31 * result + (updatedAt?.hashCode() ?: 0)
        result = 31 * result + (urlLegicem?.hashCode() ?: 0)
        return result
    }
}
