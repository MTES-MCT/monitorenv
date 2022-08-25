package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlThemes.ControlThemeEntity

data class ControlThemeDataOutput(
    val id: Int,
    val theme_level_1: String,
    val theme_level_2: String? = null
) {
    companion object {
        fun fromControlThemeEntity(controlTheme: ControlThemeEntity) = ControlThemeDataOutput(
            id = controlTheme.id,
            theme_level_1 = controlTheme.theme_level_1,
            theme_level_2 = controlTheme.theme_level_2
        )
    }
}
