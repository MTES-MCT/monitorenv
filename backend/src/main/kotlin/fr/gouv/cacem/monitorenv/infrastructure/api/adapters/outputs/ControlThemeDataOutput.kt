package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlThemes.ControlThemeEntity

data class ControlThemeDataOutput(
    val id: Int,
    val topic_level_1: String,
    val topic_level_2: String? = null
) {
    companion object {
        fun fromControlThemeEntity(controlTheme: ControlThemeEntity) = ControlThemeDataOutput(
            id = controlTheme.id,
            topic_level_1 = controlTheme.topic_level_1,
            topic_level_2 = controlTheme.topic_level_2
        )
    }
}
