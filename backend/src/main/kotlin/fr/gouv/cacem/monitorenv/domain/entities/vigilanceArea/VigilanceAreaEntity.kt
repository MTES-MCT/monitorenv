package fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea

import org.locationtech.jts.geom.MultiPolygon
import java.time.ZonedDateTime

data class VigilanceAreaEntity(
    val id: Int? = null,
    val comments: String? = null,
    val createdBy: String? = null,
    val endDatePeriod: ZonedDateTime? = null,
    val endingCondition: EndingConditionEnum? = null,
    val endingOccurrenceDate: ZonedDateTime? = null,
    val endingOccurrencesNumber: Int? = null,
    val frequency: FrequencyEnum? = null,
    val geom: MultiPolygon? = null,
    val isDeleted: Boolean,
    val isDraft: Boolean,
    val links: List<LinkEntity>? = null,
    val linkedRegulatoryAreas: List<Int>? = null,
    val name: String? = null,
    val source: String? = null,
    val startDatePeriod: ZonedDateTime? = null,
    val themes: List<String>? = null,
    val visibility: VisibilityEnum? = null,
)
