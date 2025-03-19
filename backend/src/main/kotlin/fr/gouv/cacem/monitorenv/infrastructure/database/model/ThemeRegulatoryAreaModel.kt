package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonBackReference
import fr.gouv.cacem.monitorenv.domain.entities.themes.SubThemeEntity
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
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
@Table(name = "themes_regulatory_area")
data class ThemeRegulatoryAreaModel(
    @EmbeddedId
    val id: ThemeRegulatoryAreaPk,
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "themes_id")
    @MapsId("themeId")
    val theme: ThemeModel,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "regulatory_area_id")
    @MapsId("regulatoryAreaId")
    @JsonBackReference
    val regulatoryArea: RegulatoryAreaModel,
) {
    fun toThemeEntity(subThemes: List<SubThemeEntity>): ThemeEntity = theme.toThemeEntity(subThemes)

    companion object {
        fun fromThemeEntity(
            theme: ThemeEntity,
            regulatoryArea: RegulatoryAreaModel,
        ): ThemeRegulatoryAreaModel =
            ThemeRegulatoryAreaModel(
                id = ThemeRegulatoryAreaPk(theme.id, regulatoryArea.id),
                theme = ThemeModel.fromThemeEntity(theme),
                regulatoryArea = regulatoryArea,
            )
    }
}

@Embeddable
data class ThemeRegulatoryAreaPk(
    val themeId: Int?,
    val regulatoryAreaId: Int,
) : Serializable
