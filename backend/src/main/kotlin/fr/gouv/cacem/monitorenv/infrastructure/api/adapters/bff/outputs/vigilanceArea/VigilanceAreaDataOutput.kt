package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.vigilanceArea

import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.*
import org.locationtech.jts.geom.MultiPolygon
import java.time.ZonedDateTime

data class VigilanceAreaDataOutput(
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
    val isArchived: Boolean,
    val isDraft: Boolean,
    val images: List<VigilanceAreaImageDataOutput> = mutableListOf(),
    val links: List<LinkEntity>? = null,
    val linkedAMPs: List<Int>? = listOf(),
    val linkedRegulatoryAreas: List<Int>? = listOf(),
    val name: String? = null,
    val source: String? = null,
    val startDatePeriod: ZonedDateTime? = null,
    val themes: List<String>? = null,
    val visibility: VisibilityEnum? = null,
) {
    companion object {
        fun fromVigilanceArea(vigilanceArea: VigilanceAreaEntity): VigilanceAreaDataOutput {
            return VigilanceAreaDataOutput(
                id = vigilanceArea.id,
                comments = vigilanceArea.comments,
                computedEndDate = vigilanceArea.computedEndDate,
                createdBy = vigilanceArea.createdBy,
                endDatePeriod = vigilanceArea.endDatePeriod,
                endingCondition = vigilanceArea.endingCondition,
                endingOccurrenceDate = vigilanceArea.endingOccurrenceDate,
                endingOccurrencesNumber = vigilanceArea.endingOccurrencesNumber,
                frequency = vigilanceArea.frequency,
                geom = vigilanceArea.geom,
                isArchived = vigilanceArea.isArchived,
                isDraft = vigilanceArea.isDraft,
                images = vigilanceArea.images?.map { VigilanceAreaImageDataOutput.fromVigilanceAreaImage(it) }
                    ?: emptyList(),
                links = vigilanceArea.links,
                linkedAMPs = vigilanceArea.linkedAMPs,
                linkedRegulatoryAreas = vigilanceArea.linkedRegulatoryAreas,
                name = vigilanceArea.name,
                source = vigilanceArea.source,
                startDatePeriod = vigilanceArea.startDatePeriod,
                themes = vigilanceArea.themes,
                visibility = vigilanceArea.visibility,
            )
        }
    }
}
