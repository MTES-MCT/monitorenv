package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonBackReference
import fr.gouv.cacem.monitorenv.domain.entities.themes.SubThemeEntity
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
@Table(name = "sub_themes_regulatory_area")
data class SubThemeRegulatoryAreaModel(
    @EmbeddedId
    val id: SubThemeRegulationPk,
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sub_themes_id")
    @MapsId("subThemeId")
    val subTheme: SubThemeModel,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "regulatory_area_id")
    @MapsId("regulatoryAreaId")
    @JsonBackReference
    val regulatoryArea: RegulatoryAreaModel,
) {
    fun toSubThemeEntity(): SubThemeEntity = subTheme.toSubThemeEntity()
}

@Embeddable
data class SubThemeRegulationPk(
    val subThemeId: Int,
    val regulatoryAreaId: Int,
) : Serializable
