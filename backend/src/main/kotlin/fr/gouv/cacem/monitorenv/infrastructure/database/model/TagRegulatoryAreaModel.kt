package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonBackReference
import fr.gouv.cacem.monitorenv.domain.entities.themes.SubTagEntity
import fr.gouv.cacem.monitorenv.domain.entities.themes.TagEntity
import jakarta.persistence.Embeddable
import jakarta.persistence.EmbeddedId
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.MapsId
import jakarta.persistence.OneToOne
import jakarta.persistence.Table
import java.io.Serializable

@Entity
@Table(name = "tags_regulatory_area")
data class TagRegulatoryAreaModel(
    @EmbeddedId
    val id: TagRegulatoryAreaPk,
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tags_id")
    @MapsId("tagId")
    val tag: TagModel,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "regulatory_area_id")
    @MapsId("regulatoryAreaId")
    @JsonBackReference
    val regulatoryArea: RegulatoryAreaModel,
) {
    fun toTagEntity(subTags: List<SubTagEntity>): TagEntity = tag.toTagEntity(subTags)

    companion object {
        fun fromTagEntity(
            tag: TagEntity,
            regulatoryArea: RegulatoryAreaModel,
        ): TagRegulatoryAreaModel =
            TagRegulatoryAreaModel(
                id = TagRegulatoryAreaPk(tag.id, regulatoryArea.id),
                tag = TagModel.fromTagEntity(tag),
                regulatoryArea = regulatoryArea,
            )
    }
}

@Embeddable
data class TagRegulatoryAreaPk(
    val tagId: Int?,
    val regulatoryAreaId: Int,
) : Serializable
