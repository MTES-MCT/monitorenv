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
@Table(name = "sub_tags_vigilance_area")
data class SubTagVigilanceAreaModel(
    @EmbeddedId
    var id: SubTagVigilanceAreaPk,
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sub_tags_id")
    @MapsId("subTagId")
    val subTag: SubTagModel,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vigilance_areas_id")
    @MapsId("vigilanceAreaId")
    @JsonBackReference
    val vigilanceArea: VigilanceAreaModel,
) {
    companion object {
        fun fromSubTagEntity(
            subTag: SubTagEntity,
            vigilanceAreaModel: VigilanceAreaModel,
            tagEntity: TagEntity,
        ): SubTagVigilanceAreaModel =
            SubTagVigilanceAreaModel(
                id = SubTagVigilanceAreaPk(subTag.id, vigilanceAreaModel.id),
                subTag = SubTagModel.fromSubTagEntity(subTag, TagModel.fromTagEntity(tagEntity)),
                vigilanceArea = vigilanceAreaModel,
            )
    }

    fun toSubTagEntity(): SubTagEntity = subTag.toSubTagEntity()
}

@Embeddable
data class SubTagVigilanceAreaPk(
    val subTagId: Int,
    val vigilanceAreaId: Int?,
) : Serializable
