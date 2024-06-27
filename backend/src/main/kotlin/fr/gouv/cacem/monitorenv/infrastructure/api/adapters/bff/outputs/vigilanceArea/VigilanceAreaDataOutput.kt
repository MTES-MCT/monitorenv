package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.vigilanceArea

import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.*
import org.locationtech.jts.geom.MultiPolygon
import java.time.ZonedDateTime

data class VigilanceAreaDataOutput(
    val id: Int? = null,
    val comments: String? = null,
    val createdBy: String? = null,
    val endDatePeriod: ZonedDateTime ? = null,
    val endingCondition: EndingConditionEnum? = null,
    val endingOccurenceDate: ZonedDateTime? = null,
    val endingOccurrencesNumber: Int? = null,
    val frequency: FrequencyEnum? = null,
    val geom: MultiPolygon? = null,
    val isDraft: Boolean,
    val links: List<LinkEntity> ? = null,
    val name: String ? = null,
    val period: List<String> ? = null,
    val source: String? = null,
    val startDatePeriod: ZonedDateTime? = null,
    val themes: List<String> ? = null,
    val visibility: VisibilityEnum? = null,
) {
    companion object {
        fun fromVigilanceArea(vigilanceArea: VigilanceAreaEntity): VigilanceAreaDataOutput {
            return VigilanceAreaDataOutput(
                id = vigilanceArea.id,
                comments = vigilanceArea.comments,
                createdBy = vigilanceArea.createdBy,
                endDatePeriod = vigilanceArea.endDatePeriod,
                endingCondition = vigilanceArea.endingCondition,
                endingOccurenceDate = vigilanceArea.endingOccurenceDate,
                endingOccurrencesNumber = vigilanceArea.endingOccurrencesNumber,
                frequency = vigilanceArea.frequency,
                geom = vigilanceArea.geom,
                isDraft = vigilanceArea.isDraft,
                links = vigilanceArea.links,
                name = vigilanceArea.name,
                source = vigilanceArea.source,
                startDatePeriod = vigilanceArea.startDatePeriod,
                themes = vigilanceArea.themes,
                visibility = vigilanceArea.visibility,
            )
        }
    }
}
