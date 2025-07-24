package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.vigilanceArea

import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.EndingConditionEnum
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.FrequencyEnum
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.LinkEntity
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VisibilityEnum
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.tags.TagOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.tags.TagOutput.Companion.fromTagEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.themes.ThemeOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.themes.ThemeOutput.Companion.fromThemeEntity
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
    val isAtAllTimes: Boolean,
    val isArchived: Boolean,
    val isDraft: Boolean,
    val images: List<VigilanceAreaImageDataOutput> = mutableListOf(),
    val links: List<LinkEntity>? = null,
    val linkedAMPs: List<Int>? = listOf(),
    val linkedRegulatoryAreas: List<Int>? = listOf(),
    val name: String? = null,
    val seaFront: String? = null,
    val sources: List<VigilanceAreaSourceOutput>,
    val startDatePeriod: ZonedDateTime? = null,
    val themes: List<ThemeOutput>? = null,
    val visibility: VisibilityEnum? = null,
    val createdAt: ZonedDateTime?,
    val updatedAt: ZonedDateTime?,
    val tags: List<TagOutput>,
    val validatedAt: ZonedDateTime?,
) {
    companion object {
        fun fromVigilanceArea(vigilanceArea: VigilanceAreaEntity): VigilanceAreaDataOutput =
            VigilanceAreaDataOutput(
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
                images =
                    vigilanceArea.images?.map { VigilanceAreaImageDataOutput.fromVigilanceAreaImage(it) }
                        ?: emptyList(),
                links = vigilanceArea.links,
                linkedAMPs = vigilanceArea.linkedAMPs,
                linkedRegulatoryAreas = vigilanceArea.linkedRegulatoryAreas,
                name = vigilanceArea.name,
                seaFront = vigilanceArea.seaFront,
                sources = vigilanceArea.sources.map { VigilanceAreaSourceOutput.fromVigilanceAreaSourceEntity(it) },
                startDatePeriod = vigilanceArea.startDatePeriod,
                themes = vigilanceArea.themes.map { fromThemeEntity(it) },
                visibility = vigilanceArea.visibility,
                createdAt = vigilanceArea.createdAt,
                updatedAt = vigilanceArea.updatedAt,
                isAtAllTimes = vigilanceArea.isAtAllTimes,
                tags = vigilanceArea.tags.map { fromTagEntity(it) },
                validatedAt = vigilanceArea.validatedAt,
            )
    }
}
