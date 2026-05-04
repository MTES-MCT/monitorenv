package fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea

import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import org.locationtech.jts.geom.MultiPolygon
import java.time.ZonedDateTime

data class RegulatoryAreaEntity(
    val id: Int,
    val additionalRefReg: List<AdditionalRefRegEntity>? = listOf(),
    val authorizationPeriods: String? = null,
    val creation: ZonedDateTime? = null,
    val date: ZonedDateTime? = null,
    val dateFin: ZonedDateTime? = null,
    val editeur: String? = null,
    val editionBo: ZonedDateTime? = null,
    val editionCacem: ZonedDateTime? = null,
    val facade: String? = null,
    val geom: MultiPolygon? = null,
    val layerName: String? = null,
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
}
