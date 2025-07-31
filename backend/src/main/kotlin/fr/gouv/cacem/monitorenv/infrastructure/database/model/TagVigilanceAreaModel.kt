package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import jakarta.persistence.Embeddable
import jakarta.persistence.EmbeddedId
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.MapsId
import jakarta.persistence.OneToOne
import jakarta.persistence.Table
import org.hibernate.annotations.BatchSize
import java.io.Serializable

@Entity
@Table(name = "tags_vigilance_areas")
@BatchSize(size = 30)
data class TagVigilanceAreaModel(
    @EmbeddedId
    var id: TagVigilanceAreaPk,
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tags_id")
    @MapsId("tagId")
    val tag: TagModel,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vigilance_areas_id")
    @MapsId("vigilanceAreaId")
    val vigilanceArea: VigilanceAreaModel,
) {
    companion object {
        fun fromTagEntity(
            tag: TagEntity,
            vigilanceAreaModel: VigilanceAreaModel,
        ): TagVigilanceAreaModel =
            TagVigilanceAreaModel(
                id = TagVigilanceAreaPk(tag.id, vigilanceAreaModel.id),
                tag = TagModel.fromTagEntity(tag),
                vigilanceArea = vigilanceAreaModel,
            )

        fun fromTagEntities(
            tags: List<TagEntity>,
            vigilanceAreaModel: VigilanceAreaModel,
        ): List<TagVigilanceAreaModel> =
            tags
                .map { theme -> fromTagEntity(theme, vigilanceAreaModel) }
                .plus(
                    tags.flatMap { theme ->
                        theme.subTags.map { subTag ->
                            fromTagEntity(subTag, vigilanceAreaModel)
                        }
                    },
                )

        fun toTagEntities(tags: List<TagVigilanceAreaModel>): List<TagEntity> {
            val parents = tags.map { it.tag }.filter { it.parent === null }

            return parents.map { parent ->
                val subTags = tags.filter { it.tag.parent?.id == parent.id }.map { it.tag }
                parent.subTags = subTags
                return@map parent.toTagEntity()
            }
        }
    }
}

@Embeddable
data class TagVigilanceAreaPk(
    val tagId: Int,
    val vigilanceAreaId: Int?,
) : Serializable
