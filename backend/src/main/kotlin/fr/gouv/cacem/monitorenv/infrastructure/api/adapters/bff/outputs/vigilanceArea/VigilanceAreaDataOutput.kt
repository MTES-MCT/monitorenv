package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.vigilanceArea

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
    val createdBy: String? = null,
    val geom: MultiPolygon? = null,
    val isDraft: Boolean,
    val images: List<VigilanceAreaImageDataOutput> = mutableListOf(),
    val links: List<LinkEntity>? = null,
    val linkedAMPs: List<Int>? = listOf(),
    val linkedRegulatoryAreas: List<Int>? = listOf(),
    val name: String? = null,
    val seaFront: String? = null,
    val sources: List<VigilanceAreaSourceOutput>,
    val themes: List<ThemeOutput>? = null,
    val visibility: VisibilityEnum? = null,
    val createdAt: ZonedDateTime?,
    val updatedAt: ZonedDateTime?,
    val tags: List<TagOutput>,
    val validatedAt: ZonedDateTime?,
    val periods: List<VigilanceAreaPeriodDataOutput>,
) {
    companion object {
        fun fromVigilanceArea(vigilanceArea: VigilanceAreaEntity): VigilanceAreaDataOutput =
            VigilanceAreaDataOutput(
                id = vigilanceArea.id,
                comments = vigilanceArea.comments,
                createdBy = vigilanceArea.createdBy,
                geom = vigilanceArea.geom,
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
                themes = vigilanceArea.themes.map { fromThemeEntity(it) },
                visibility = vigilanceArea.visibility,
                createdAt = vigilanceArea.createdAt,
                updatedAt = vigilanceArea.updatedAt,
                tags = vigilanceArea.tags.map { fromTagEntity(it) },
                validatedAt = vigilanceArea.validatedAt,
                periods = vigilanceArea.periods.map { VigilanceAreaPeriodDataOutput.fromVigilanceAreaPeriod(it) },
            )
    }
}
