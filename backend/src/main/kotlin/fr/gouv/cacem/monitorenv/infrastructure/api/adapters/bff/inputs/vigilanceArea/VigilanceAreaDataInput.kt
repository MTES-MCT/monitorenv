package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.vigilanceArea

import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.EndingConditionEnum
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.FrequencyEnum
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.ImageEntity
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.LinkEntity
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VisibilityEnum
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
    val isAtAllTimes: Boolean,
    val isDraft: Boolean,
    val images: List<ImageDataInput>? = listOf(),
    val links: List<LinkEntity>? = null,
    val linkedAMPs: List<Int>? = listOf(),
    val linkedRegulatoryAreas: List<Int>? = listOf(),
    val name: String,
    val seaFront: String?,
    val source: String? = null,
    val startDatePeriod: ZonedDateTime? = null,
    val themes: List<String>? = null,
    val visibility: VisibilityEnum? = null,
    val createdAt: ZonedDateTime? = null,
    val updatedAt: ZonedDateTime? = null,
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
            isAtAllTimes = this.isAtAllTimes,
            isArchived = this.isArchived,
            isDeleted = false,
            isDraft = this.isDraft,
            images =
                this.images?.map { image ->
                    ImageEntity(
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
            seaFront = this.seaFront,
            source = this.source,
            startDatePeriod = this.startDatePeriod,
            themes = this.themes,
            visibility = this.visibility,
            createdAt = this.createdAt,
            updatedAt = this.updatedAt,
        )
    }
}
