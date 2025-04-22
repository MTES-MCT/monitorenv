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
@Table(name = "themes_vigilance_areas")
data class ThemeVigilanceAreaModel(
    @EmbeddedId
    var id: ThemeVigilanceAreaPk,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "themes_id")
    @MapsId("themeId")
    val theme: ThemeModel,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vigilance_areas_id")
    @MapsId("vigilanceAreaId")
    @JsonBackReference
    val vigilanceArea: VigilanceAreaModel,
) {
    companion object {
        fun fromThemeEntity(
            theme: ThemeEntity,
            vigilanceAreaModel: VigilanceAreaModel,
        ): ThemeVigilanceAreaModel =
            ThemeVigilanceAreaModel(
                id = ThemeVigilanceAreaPk(theme.id, vigilanceAreaModel.id),
                theme = ThemeModel.fromThemeEntity(theme),
                vigilanceArea = vigilanceAreaModel,
            )

        fun fromThemeEntities(
            themes: List<ThemeEntity>,
            vigilanceAreaModel: VigilanceAreaModel,
        ): List<ThemeVigilanceAreaModel> =
            themes
                .map { theme -> fromThemeEntity(theme, vigilanceAreaModel) }
                .plus(
                    themes.flatMap { theme ->
                        theme.subThemes.map { subTheme ->
                            fromThemeEntity(subTheme, vigilanceAreaModel)
                        }
                    },
                )

        fun toThemeEntities(themes: List<ThemeVigilanceAreaModel>): List<ThemeEntity> {
            val parents = themes.map { it.theme }.filter { it.parent === null }

            return parents.map { parent ->
                val subThemes = themes.filter { it.theme.parent?.id == parent.id }.map { it.theme }
                parent.subThemes = subThemes
                return@map parent.toThemeEntity()
            }
        }
    }

    @Embeddable
    data class ThemeVigilanceAreaPk(
        val themeId: Int,
        val vigilanceAreaId: Int?,
    ) : Serializable
}
