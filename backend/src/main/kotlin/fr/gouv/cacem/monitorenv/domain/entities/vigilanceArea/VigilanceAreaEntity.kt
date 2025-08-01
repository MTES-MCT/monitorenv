package fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea

import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import org.locationtech.jts.geom.MultiPolygon
import java.time.ZonedDateTime

data class VigilanceAreaEntity(
    val id: Int? = null,
    val comments: String? = null,
    val computedEndDate: ZonedDateTime? = null,
    val createdBy: String? = null,
    val endDatePeriod: ZonedDateTime? = null,
    val endingCondition: EndingConditionEnum? = null,
    val endingOccurrenceDate: ZonedDateTime? = null,
    val endingOccurrencesNumber: Int? = null,
    val frequency: FrequencyEnum? = null,
    val geom: MultiPolygon? = null,
    val images: List<ImageEntity>? = listOf(),
    val isAtAllTimes: Boolean,
    val isArchived: Boolean,
    val isDeleted: Boolean,
    val isDraft: Boolean,
    val links: List<LinkEntity>? = null,
    val linkedAMPs: List<Int>? = listOf(),
    val linkedRegulatoryAreas: List<Int>? = listOf(),
    val name: String,
    val seaFront: String? = null,
    val sources: List<VigilanceAreaSourceEntity>,
    val startDatePeriod: ZonedDateTime? = null,
    val themes: List<ThemeEntity>,
    val tags: List<TagEntity>,
    val visibility: VisibilityEnum? = null,
    val createdAt: ZonedDateTime?,
    val updatedAt: ZonedDateTime?,
    val validatedAt: ZonedDateTime?,
)
