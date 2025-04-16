package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonBackReference
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
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
@Table(name = "themes_regulatory_areas")
data class ThemeRegulatoryAreaModel(
    @EmbeddedId
    val id: ThemeRegulatoryAreaPk,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "themes_id")
    @MapsId("themeId")
    val theme: ThemeModel,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "regulatory_areas_id")
    @MapsId("regulatoryAreaId")
    @JsonBackReference
    val regulatoryArea: RegulatoryAreaModel,
) {
    companion object {
        fun toThemeEntities(themes: List<ThemeRegulatoryAreaModel>): List<ThemeEntity> {
            val parents = themes.map { it.theme }.filter { it.parent === null }

            return parents.map { parent ->
                val subThemes = themes.filter { it.theme.parent?.id == parent.id }.map { it.theme }
                parent.subThemes = subThemes
                return@map parent.toThemeEntity()
            }
        }
    }

    @Embeddable
    data class ThemeRegulatoryAreaPk(
        val themeId: Int,
        val regulatoryAreaId: Int,
    ) : Serializable
}
