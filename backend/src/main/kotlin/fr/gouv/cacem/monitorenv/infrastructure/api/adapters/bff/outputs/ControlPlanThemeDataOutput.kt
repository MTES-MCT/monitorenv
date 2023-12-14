package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlPlanTheme.ControlPlanThemeEntity

data class ControlPlanThemeDataOutput(
    val id: Int,
    val theme: String,
    val subTheme: String,
    val allowedTags: List<String>? = null,
    val year: Int,
) {
    companion object {
        fun fromControlPlanThemeEntity(controlPlanTheme: ControlPlanThemeEntity) =
            ControlPlanThemeDataOutput(
                id = controlPlanTheme.id,
                theme = controlPlanTheme.theme,
                subTheme = controlPlanTheme.subTheme,
                allowedTags = controlPlanTheme.allowedTags,
                year = controlPlanTheme.year,
            )
    }
}
