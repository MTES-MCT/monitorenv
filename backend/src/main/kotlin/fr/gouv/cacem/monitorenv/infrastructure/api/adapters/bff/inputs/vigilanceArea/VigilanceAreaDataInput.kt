package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.vigilanceArea

import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.*
import io.ktor.util.*
import org.locationtech.jts.geom.MultiPolygon
import java.time.ZonedDateTime

data class VigilanceAreaDataInput(
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
    val images: List<ImageInputEntity>? = listOf(),
    val links: List<LinkEntity>? = null,
    val linkedAMPs: List<Int>? = listOf(),
    val linkedRegulatoryAreas: List<Int>? = listOf(),
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
            computedEndDate = this.computedEndDate,
            createdBy = this.createdBy,
            endDatePeriod = this.endDatePeriod,
            endingCondition = this.endingCondition,
            endingOccurrenceDate = this.endingOccurrenceDate,
            endingOccurrencesNumber = this.endingOccurrencesNumber,
            frequency = this.frequency,
            geom = this.geom,
            isArchived = this.isArchived,
            isDeleted = false,
            isDraft = this.isDraft,
            images = this.images?.map { image ->
                return@map ImageEntity(
                    id = image.id,
                    vigilanceAreaId = image.vigilanceAreaId,
                    name = image.name,
                    content = image.content.decodeBase64Bytes(),
                    mimeType = image.mimeType,
                    size = image.size,
                )
            },
            links = this.links,
            linkedAMPs = this.linkedAMPs,
            linkedRegulatoryAreas = this.linkedRegulatoryAreas,
            name = this.name,
            source = this.source,
            startDatePeriod = this.startDatePeriod,
            themes = this.themes,
            visibility = this.visibility,
        )
    }
}
