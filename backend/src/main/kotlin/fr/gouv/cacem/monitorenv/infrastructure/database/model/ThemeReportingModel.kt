package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonBackReference
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import fr.gouv.cacem.monitorenv.infrastructure.database.model.reportings.ReportingModel
import jakarta.persistence.*
import java.io.Serializable

@Entity
@Table(name = "themes_reportings")
data class ThemeReportingModel(
    @EmbeddedId
    val id: ThemeReportingPk,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "themes_id")
    @MapsId("themeId")
    val theme: ThemeModel,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reportings_id")
    @MapsId("reportingId")
    @JsonBackReference
    val reporting: ReportingModel,
) {
    companion object {
        fun toThemeEntities(themes: List<ThemeReportingModel>): List<ThemeEntity> {
            val parentsFromSubThemes =
                themes
                    .map { it.theme }
                    .filter { it.parent !== null }
                    .distinctBy { it.parent?.id }
                    .map { it.parent }

            if (parentsFromSubThemes.isNotEmpty()) {
                return parentsFromSubThemes.map { parent ->
                    if (parent == null) {
                        return listOf()
                    }
                    val subThemes = themes.filter { it.theme.parent?.id == parent.id }.map { it.theme }
                    parent.subThemes = subThemes
                    return@map parent.toThemeEntity()
                }
            }

            val themesWithoutSubThemes = themes.map { it.theme }.filter { it.parent === null }
            if (themesWithoutSubThemes.isNotEmpty()) {
                return themesWithoutSubThemes.map { theme ->
                    theme.subThemes = emptyList()
                    theme.toThemeEntity()
                }
            }

            return emptyList()
        }

        fun fromThemeEntity(
            theme: ThemeEntity,
            reporting: ReportingModel,
        ): MutableSet<ThemeReportingModel> =
            if (theme.subThemes.isEmpty()) {
                mutableSetOf(
                    ThemeReportingModel(
                        id = ThemeReportingPk(theme.id, reporting.id),
                        theme = ThemeModel.fromThemeEntity(theme),
                        reporting = reporting,
                    ),
                )
            } else {
                theme.subThemes
                    .map { subTheme ->
                        ThemeReportingModel(
                            id = ThemeReportingPk(subTheme.id, reporting.id),
                            theme = ThemeModel.fromThemeEntity(subTheme),
                            reporting = reporting,
                        )
                    }.toMutableSet()
            }
    }
}

@Embeddable
data class ThemeReportingPk(
    val themeId: Int,
    val reportingId: Int?,
) : Serializable
