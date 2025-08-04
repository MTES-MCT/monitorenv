package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import jakarta.persistence.Embeddable
import jakarta.persistence.EmbeddedId
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.MapsId
import jakarta.persistence.Table
import java.io.Serializable

@Entity
@Table(name = "tags_reportings")
data class TagReportingModel(
    @EmbeddedId
    val id: TagReportingPk,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tags_id")
    @MapsId("themeId")
    val tag: TagModel,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reportings_id")
    @MapsId("reportingId")
    val reporting: ReportingModel,
) {
    companion object {
        fun toTagEntities(tags: List<TagReportingModel>): List<TagEntity> {
            val parents = tags.map { it.tag }.filter { it.parent === null }

            return parents.map { parent ->
                val subTags = tags.filter { it.tag.parent?.id == parent.id }.map { it.tag }
                parent.subTags = subTags
                return@map parent.toTagEntity()
            }
        }

        fun fromTagEntity(
            tag: TagEntity,
            reporting: ReportingModel,
        ): TagReportingModel =
            TagReportingModel(
                id = TagReportingPk(tag.id, reporting.id),
                tag = TagModel.fromTagEntity(tag),
                reporting = reporting,
            )

        fun fromTagEntities(
            tags: List<TagEntity>,
            reporting: ReportingModel,
        ): List<TagReportingModel> =
            tags
                .map { theme -> fromTagEntity(theme, reporting) }
                .plus(
                    tags.flatMap { theme ->
                        theme.subTags.map { subTag ->
                            fromTagEntity(subTag, reporting)
                        }
                    },
                )
    }
}

@Embeddable
data class TagReportingPk(
    val themeId: Int,
    val reportingId: Int?,
) : Serializable
