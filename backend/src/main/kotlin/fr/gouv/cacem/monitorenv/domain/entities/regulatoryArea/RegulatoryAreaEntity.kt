package fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea

import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import org.locationtech.jts.geom.MultiPolygon
import java.time.ZonedDateTime

data class RegulatoryAreaEntity(
    val id: Int,
    val areaType: AreaTypeEnum,
    val additionalRefReg: List<AdditionalRefRegEntity>? = listOf(),
    val authorizationPeriods: String? = null,
    val creation: ZonedDateTime? = null,
    val date: ZonedDateTime? = null,
    val dateFin: ZonedDateTime? = null,
    val editeur: String? = null,
    val editionBo: ZonedDateTime? = null,
    val editionCacem: ZonedDateTime? = null,
    val extent: DoubleArray? = null,
    val facade: String? = null,
    val geom: MultiPolygon? = null,
    val layerName: String? = null,
    val location: String?,
    val observation: String? = null,
    val plan: String? = null,
    val polyName: String? = null,
    val prohibitionPeriods: String? = null,
    val refReg: String? = null,
    val resume: String? = null,
    val source: String? = null,
    val tags: List<TagEntity>,
    val themes: List<ThemeEntity>,
    val type: String? = null,
    val url: String? = null,
) {
    fun isNew(): Boolean =
        creation != null &&
            creation.isAfter(
                ZonedDateTime.now().minusDays(30),
            )

    fun isRecentlyUpdated(): Boolean {
        val mostRecentUpdatedDate = listOfNotNull(editionBo, editionCacem).maxOrNull()
        return mostRecentUpdatedDate != null &&
            mostRecentUpdatedDate.isAfter(
                ZonedDateTime.now().minusDays(30),
            )
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as RegulatoryAreaEntity

        if (id != other.id) return false
        if (areaType != other.areaType) return false
        if (additionalRefReg != other.additionalRefReg) return false
        if (authorizationPeriods != other.authorizationPeriods) return false
        if (creation != other.creation) return false
        if (date != other.date) return false
        if (dateFin != other.dateFin) return false
        if (editeur != other.editeur) return false
        if (editionBo != other.editionBo) return false
        if (editionCacem != other.editionCacem) return false
        if (!extent.contentEquals(other.extent)) return false
        if (facade != other.facade) return false
        if (geom != other.geom) return false
        if (layerName != other.layerName) return false
        if (location != other.location) return false
        if (observation != other.observation) return false
        if (plan != other.plan) return false
        if (polyName != other.polyName) return false
        if (prohibitionPeriods != other.prohibitionPeriods) return false
        if (refReg != other.refReg) return false
        if (resume != other.resume) return false
        if (source != other.source) return false
        if (tags != other.tags) return false
        if (themes != other.themes) return false
        if (type != other.type) return false
        if (url != other.url) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id
        result = 31 * result + areaType.hashCode()
        result = 31 * result + (additionalRefReg?.hashCode() ?: 0)
        result = 31 * result + (authorizationPeriods?.hashCode() ?: 0)
        result = 31 * result + (creation?.hashCode() ?: 0)
        result = 31 * result + (date?.hashCode() ?: 0)
        result = 31 * result + (dateFin?.hashCode() ?: 0)
        result = 31 * result + (editeur?.hashCode() ?: 0)
        result = 31 * result + (editionBo?.hashCode() ?: 0)
        result = 31 * result + (editionCacem?.hashCode() ?: 0)
        result = 31 * result + (extent?.contentHashCode() ?: 0)
        result = 31 * result + (facade?.hashCode() ?: 0)
        result = 31 * result + (geom?.hashCode() ?: 0)
        result = 31 * result + (layerName?.hashCode() ?: 0)
        result = 31 * result + (location?.hashCode() ?: 0)
        result = 31 * result + (observation?.hashCode() ?: 0)
        result = 31 * result + (plan?.hashCode() ?: 0)
        result = 31 * result + (polyName?.hashCode() ?: 0)
        result = 31 * result + (prohibitionPeriods?.hashCode() ?: 0)
        result = 31 * result + (refReg?.hashCode() ?: 0)
        result = 31 * result + (resume?.hashCode() ?: 0)
        result = 31 * result + (source?.hashCode() ?: 0)
        result = 31 * result + tags.hashCode()
        result = 31 * result + themes.hashCode()
        result = 31 * result + (type?.hashCode() ?: 0)
        result = 31 * result + (url?.hashCode() ?: 0)
        return result
    }
}
