package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.controlPlans

import fr.gouv.cacem.monitorenv.domain.entities.controlPlan.ControlPlanSubThemeEntity

data class ControlPlanSubThemeDataOutput(
    val id: Int,
    val themeId: Int,
    val subTheme: String,
    val year: Int,
) {
    companion object {
        fun fromControlPlanSubThemeEntity(controlPlanSubTheme: ControlPlanSubThemeEntity) =
            ControlPlanSubThemeDataOutput(
                id = controlPlanSubTheme.id,
                themeId = controlPlanSubTheme.themeId,
                subTheme = controlPlanSubTheme.subTheme,
                year = controlPlanSubTheme.year,
            )
    }
}
