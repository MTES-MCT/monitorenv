package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonBackReference
import fr.gouv.cacem.monitorenv.domain.entities.themes.SubTagEntity
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
@Table(name = "sub_tags_regulatory_area")
data class SubTagRegulatoryAreaModel(
    @EmbeddedId
    val id: SubTagRegulatoryAreaPk,
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sub_tags_id")
    @MapsId("subTagId")
    val subTags: SubTagModel,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "regulatory_area_id")
    @MapsId("regulatoryAreaId")
    @JsonBackReference
    val regulatoryArea: RegulatoryAreaModel,
) {
    fun toSubTagEntity(): SubTagEntity = subTags.toSubTagEntity()
}

@Embeddable
data class SubTagRegulatoryAreaPk(
    val subTagId: Int,
    val regulatoryAreaId: Int,
) : Serializable
