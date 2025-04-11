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
import java.util.UUID

@Entity
@Table(name = "themes_env_actions")
data class ThemeEnvActionModel(
    @EmbeddedId
    val id: ThemeEnvActionPk,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "themes_id")
    @MapsId("themeId")
    val theme: ThemeModel,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "env_actions_id")
    @MapsId("envActionId")
    @JsonBackReference
    val envAction: EnvActionModel,
) {
    companion object {
        fun fromThemeEntity(
            theme: ThemeEntity,
            envAction: EnvActionModel,
        ): ThemeEnvActionModel =
            ThemeEnvActionModel(
                id = ThemeEnvActionPk(theme.id, envAction.id),
                theme = ThemeModel.fromThemeEntity(theme),
                envAction = envAction,
            )

        fun fromThemeEntities(
            themes: List<ThemeEntity>,
            envAction: EnvActionModel,
        ): Set<ThemeEnvActionModel> =
            themes
                .map { theme -> fromThemeEntity(theme, envAction) }
                .plus(
                    themes.flatMap { theme ->
                        theme.subThemes.map { subTheme ->
                            fromThemeEntity(subTheme, envAction)
                        }
                    },
                ).toSet()

        fun toThemeEntities(themes: List<ThemeEnvActionModel>): List<ThemeEntity> {
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
data class ThemeEnvActionPk(
    val themeId: Int,
    val envActionId: UUID,
) : Serializable
