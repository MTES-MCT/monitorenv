package fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea

import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import org.locationtech.jts.geom.MultiPolygon
import java.time.ZonedDateTime

data class VigilanceAreaEntity(
    val id: Int? = null,
    val comments: String? = null,
    val createdBy: String? = null,
    val geom: MultiPolygon? = null,
    val images: List<ImageEntity>? = listOf(),
    val isDeleted: Boolean,
    val isDraft: Boolean,
    val links: List<LinkEntity>? = null,
    val linkedAMPs: List<Int>? = listOf(),
    val linkedRegulatoryAreas: List<Int>? = listOf(),
    val name: String,
    val seaFront: String? = null,
    val sources: List<VigilanceAreaSourceEntity>,
    val themes: List<ThemeEntity>,
    val tags: List<TagEntity>,
    val periods: List<VigilanceAreaPeriodEntity>,
    val visibility: VisibilityEnum? = null,
    val createdAt: ZonedDateTime?,
    val updatedAt: ZonedDateTime?,
    val validatedAt: ZonedDateTime?,
)
