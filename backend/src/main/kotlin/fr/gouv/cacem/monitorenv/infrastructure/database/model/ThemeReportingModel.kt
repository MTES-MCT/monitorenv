package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonBackReference
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
        fun toThemeEntities(themes: List<ThemeRegulatoryAreaModel>): List<ThemeEntity> {
            val parents = themes.map { it.theme }.filter { it.parent === null }

            return parents.map { parent ->
                val subTags = themes.filter { it.theme.parent?.id == parent.id }.map { it.theme }
                parent.subThemes = subTags
                return@map parent.toThemeEntity()
            }
        }
    }
}

@Embeddable
data class ThemeReportingPk(
    val themeId: Int,
    val reportingId: Int,
) : Serializable
