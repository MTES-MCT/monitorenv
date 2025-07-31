package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import fr.gouv.cacem.monitorenv.infrastructure.database.model.reportings.ReportingModel
import jakarta.persistence.Embeddable
import jakarta.persistence.EmbeddedId
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.MapsId
import jakarta.persistence.Table
import org.hibernate.annotations.BatchSize
import java.io.Serializable

@Entity
@Table(name = "themes_reportings")
@BatchSize(size = 30)
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
    val reporting: ReportingModel,
) {
    companion object {
        fun toThemeEntities(themes: List<ThemeReportingModel>): List<ThemeEntity> {
            val parents = themes.map { it.theme }.filter { it.parent === null }

            return parents.map { parent ->
                val subThemes = themes.filter { it.theme.parent?.id == parent.id }.map { it.theme }
                parent.subThemes = subThemes
                return@map parent.toThemeEntity()
            }
        }

        fun fromThemeEntity(
            theme: ThemeEntity,
            reporting: ReportingModel,
        ): MutableSet<ThemeReportingModel> =
            listOf(
                ThemeReportingModel(
                    id = ThemeReportingPk(theme.id, reporting.id),
                    theme = ThemeModel.fromThemeEntity(theme),
                    reporting = reporting,
                ),
            ).plus(
                theme.subThemes.map { subTheme ->
                    ThemeReportingModel(
                        id = ThemeReportingPk(subTheme.id, reporting.id),
                        theme = ThemeModel.fromThemeEntity(subTheme),
                        reporting = reporting,
                    )
                },
            ).toMutableSet()
    }
}

@Embeddable
data class ThemeReportingPk(
    val themeId: Int,
    val reportingId: Int?,
) : Serializable
