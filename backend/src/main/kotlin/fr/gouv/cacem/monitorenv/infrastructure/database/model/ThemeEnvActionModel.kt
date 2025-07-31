package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import jakarta.persistence.*
import java.io.Serializable
import java.util.*

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
        ): List<ThemeEnvActionModel> =
            themes
                .map { theme -> fromThemeEntity(theme, envAction) }
                .plus(
                    themes.flatMap { theme ->
                        theme.subThemes.map { subTheme ->
                            fromThemeEntity(subTheme, envAction)
                        }
                    },
                )

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
