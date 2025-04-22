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

data class VigilanceAreasDataOutput(
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
    val links: List<LinkEntity>? = null,
    val linkedAMPs: List<Int>? = listOf(),
    val linkedRegulatoryAreas: List<Int>? = listOf(),
    val name: String? = null,
    val seaFront: String?,
    val source: String? = null,
    val startDatePeriod: ZonedDateTime? = null,
    val themes: List<ThemeOutput>,
    val visibility: VisibilityEnum? = null,
    val tags: List<TagOutput>,
) {
    companion object {
        fun fromVigilanceArea(vigilanceArea: VigilanceAreaEntity): VigilanceAreasDataOutput =
            VigilanceAreasDataOutput(
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
                isAtAllTimes = vigilanceArea.isAtAllTimes,
                isArchived = vigilanceArea.isArchived,
                isDraft = vigilanceArea.isDraft,
                links = vigilanceArea.links,
                linkedAMPs = vigilanceArea.linkedAMPs,
                linkedRegulatoryAreas = vigilanceArea.linkedRegulatoryAreas,
                name = vigilanceArea.name,
                seaFront = vigilanceArea.seaFront,
                source = vigilanceArea.source,
                startDatePeriod = vigilanceArea.startDatePeriod,
                themes = vigilanceArea.themes.map { fromThemeEntity(it) },
                visibility = vigilanceArea.visibility,
                tags = vigilanceArea.tags.map { fromTagEntity(it) },
            )
    }
}
