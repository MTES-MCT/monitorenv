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
@Table(name = "tags_regulatory_areas_new")
data class TagRegulatoryAreaNewModel(
    @EmbeddedId
    var id: TagRegulatoryAreaNewPk,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tags_id")
    @MapsId("tagId")
    val tag: TagModel,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "regulatory_areas_id")
    @MapsId("regulatoryAreaId")
    val regulatoryArea: RegulatoryAreaNewModel,
) {
    companion object {
        fun toTagEntities(tags: List<TagRegulatoryAreaNewModel>): List<TagEntity> {
            val parents = tags.map { it.tag }.filter { it.parent === null }

            return parents.map { parent ->
                val subTags = tags.filter { it.tag.parent?.id == parent.id }.map { it.tag }
                parent.subTags = subTags
                return@map parent.toTagEntity()
            }
        }

        fun fromTagEntity(
            tag: TagEntity,
            regulatoryAreaModel: RegulatoryAreaNewModel,
        ): TagRegulatoryAreaNewModel =
            TagRegulatoryAreaNewModel(
                id = TagRegulatoryAreaNewPk(tag.id, regulatoryAreaModel.id),
                tag = TagModel.fromTagEntity(tag),
                regulatoryArea = regulatoryAreaModel,
            )

        fun fromTagEntities(
            tags: List<TagEntity>,
            regulatoryAreaModel: RegulatoryAreaNewModel,
        ): List<TagRegulatoryAreaNewModel> =
            tags
                .map { tag -> fromTagEntity(tag, regulatoryAreaModel) }
                .plus(
                    tags.flatMap { tag ->
                        tag.subTags.map { subTag ->
                            fromTagEntity(subTag, regulatoryAreaModel)
                        }
                    },
                )
    }
}

@Embeddable
data class TagRegulatoryAreaNewPk(
    val tagId: Int,
    val regulatoryAreaId: Int,
) : Serializable
