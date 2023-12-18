package fr.gouv.cacem.monitorenv.domain.entities.controlPlan

data class ControlPlanSubThemeEntity(
    val id: Int,
    val themeId: Int,
    val subTheme: String,
    val year: Int,
)
