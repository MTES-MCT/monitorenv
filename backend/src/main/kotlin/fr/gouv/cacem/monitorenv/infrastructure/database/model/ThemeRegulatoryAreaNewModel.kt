package fr.gouv.cacem.monitorenv.infrastructure.database.model

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
@Table(name = "themes_regulatory_areas_new")
data class ThemeRegulatoryAreaNewModel(
    @EmbeddedId
    var id: ThemeRegulatoryAreaNewPk,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "themes_id")
    @MapsId("themeId")
    val theme: ThemeModel,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "regulatory_areas_id")
    @MapsId("regulatoryAreaId")
    val regulatoryArea: RegulatoryAreaNewModel,
) {
    companion object {
        fun toThemeEntities(themes: List<ThemeRegulatoryAreaNewModel>): List<ThemeEntity> {
            val parents = themes.map { it.theme }.filter { it.parent === null }

            return parents.map { parent ->
                val subThemes = themes.filter { it.theme.parent?.id == parent.id }.map { it.theme }
                parent.subThemes = subThemes
                return@map parent.toThemeEntity()
            }
        }

        fun fromThemeEntity(
            theme: ThemeEntity,
            regulatoryAreaModel: RegulatoryAreaNewModel,
        ): ThemeRegulatoryAreaNewModel =
            ThemeRegulatoryAreaNewModel(
                id = ThemeRegulatoryAreaNewPk(theme.id, regulatoryAreaModel.id),
                theme = ThemeModel.fromThemeEntity(theme),
                regulatoryArea = regulatoryAreaModel,
            )

        fun fromThemesEntities(
            themes: List<ThemeEntity>,
            regulatoryAreaModel: RegulatoryAreaNewModel,
        ): List<ThemeRegulatoryAreaNewModel> =
            themes
                .map { theme -> fromThemeEntity(theme, regulatoryAreaModel) }
                .plus(
                    themes.flatMap { theme ->
                        theme.subThemes.map { subTheme ->
                            fromThemeEntity(subTheme, regulatoryAreaModel)
                        }
                    },
                )
    }
}

@Embeddable
data class ThemeRegulatoryAreaNewPk(
    val themeId: Int,
    val regulatoryAreaId: Int,
) : Serializable
