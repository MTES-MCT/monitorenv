package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonBackReference
import fr.gouv.cacem.monitorenv.domain.entities.themes.TagEntity
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
@Table(name = "tags_regulatory_area")
data class TagRegulatoryAreaModel(
    @EmbeddedId
    val id: TagRegulatoryAreaPk,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tags_id")
    @MapsId("tagId")
    val tag: TagModel,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "regulatory_area_id")
    @MapsId("regulatoryAreaId")
    @JsonBackReference
    val regulatoryArea: RegulatoryAreaModel,
) {
    fun toTagEntity(): TagEntity = tag.toTagEntity()
}

@Embeddable
data class TagRegulatoryAreaPk(
    val tagId: Int,
    val regulatoryAreaId: Int,
) : Serializable
