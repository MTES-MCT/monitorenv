package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.vigilanceArea

import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.*
import org.locationtech.jts.geom.MultiPolygon
import java.time.ZonedDateTime

data class VigilanceAreaDataInput(
    val id: Int? = null,
    val comments: String? = null,
    val createdBy: String? = null,
    val endDatePeriod: ZonedDateTime? = null,
    val endingCondition: EndingConditionEnum? = null,
    val endingOccurrenceDate: ZonedDateTime? = null,
    val endingOccurrencesNumber: Int? = null,
    val frequency: FrequencyEnum? = null,
    val geom: MultiPolygon? = null,
    val isDraft: Boolean,
    val links: List<LinkEntity>? = null,
    val name: String? = null,
    val source: String? = null,
    val startDatePeriod: ZonedDateTime? = null,
    val themes: List<String>? = null,
    val visibility: VisibilityEnum? = null,
) {
    fun toVigilanceAreaEntity(): VigilanceAreaEntity {
        return VigilanceAreaEntity(
            id = this.id,
            comments = this.comments,
            createdBy = this.createdBy,
            endDatePeriod = this.endDatePeriod,
            endingCondition = this.endingCondition,
            endingOccurrenceDate = this.endingOccurrenceDate,
            endingOccurrencesNumber = this.endingOccurrencesNumber,
            frequency = this.frequency,
            geom = this.geom,
            isDeleted = false,
            isDraft = this.isDraft,
            links = this.links,
            name = this.name,
            source = this.source,
            startDatePeriod = this.startDatePeriod,
            themes = this.themes,
            visibility = this.visibility,
        )
    }
}
