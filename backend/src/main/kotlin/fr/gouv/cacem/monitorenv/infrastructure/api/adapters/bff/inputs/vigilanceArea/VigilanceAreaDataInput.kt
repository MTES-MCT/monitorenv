package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.vigilanceArea

import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.LinkEntity
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VisibilityEnum
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.tags.TagInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.themes.ThemeInput
import org.locationtech.jts.geom.MultiPolygon
import java.time.ZonedDateTime

data class VigilanceAreaDataInput(
    val id: Int? = null,
    val comments: String? = null,
    val createdBy: String? = null,
    val geom: MultiPolygon? = null,
    val isArchived: Boolean,
    val isDraft: Boolean,
    val images: List<ImageDataInput>? = listOf(),
    val links: List<LinkEntity>? = null,
    val linkedAMPs: List<Int>? = listOf(),
    val linkedRegulatoryAreas: List<Int>? = listOf(),
    val name: String,
    val seaFront: String?,
    val sources: List<VigilanceAreaSourceInput>,
    val themes: List<ThemeInput> = listOf(),
    val visibility: VisibilityEnum? = null,
    val createdAt: ZonedDateTime? = null,
    val updatedAt: ZonedDateTime? = null,
    val tags: List<TagInput> = listOf(),
    val validatedAt: ZonedDateTime? = null,
    val periods: List<VigilanceAreaDataPeriodInput> = listOf(),
) {
    fun toVigilanceAreaEntity(): VigilanceAreaEntity =
        VigilanceAreaEntity(
            id = this.id,
            comments = this.comments,
            createdBy = this.createdBy,
            geom = this.geom,
            isArchived = this.isArchived,
            isDeleted = false,
            isDraft = this.isDraft,
            images = this.images?.map { image -> image.toImageEntity() },
            links = this.links,
            linkedAMPs = this.linkedAMPs,
            linkedRegulatoryAreas = this.linkedRegulatoryAreas,
            name = this.name,
            seaFront = this.seaFront,
            sources = this.sources.map { it.toVigilanceAreaSourceEntity() },
            themes = this.themes.map { it.toThemeEntity() },
            visibility = this.visibility,
            createdAt = this.createdAt,
            updatedAt = this.updatedAt,
            tags = tags.map { it.toTagEntity() },
            validatedAt = this.validatedAt,
            periods = periods.map { it.toVigilanceAreaPeriodEntity() },
        )
}
