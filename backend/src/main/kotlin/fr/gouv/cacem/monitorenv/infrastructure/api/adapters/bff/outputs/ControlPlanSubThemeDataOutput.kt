package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlPlanSubTheme.ControlPlanSubThemeEntity

data class ControlPlanSubThemeDataOutput(
    val id: Int,
    val theme: String,
    val subTheme: String,
    val allowedTags: List<String>? = null,
    val year: Int,
) {
    companion object {
        fun fromControlPlanSubThemeEntity(ControlPlanSubTheme: ControlPlanSubThemeEntity) =
            ControlPlanSubThemeDataOutput(
                id = ControlPlanSubTheme.id,
                theme = ControlPlanSubTheme.theme,
                subTheme = ControlPlanSubTheme.subTheme,
                allowedTags = ControlPlanSubTheme.allowedTags,
                year = ControlPlanSubTheme.year,
            )
    }
}
