package fr.gouv.cacem.monitorenv.domain.entities.controlPlanTheme

data class ControlPlanThemeEntity(
    val id: Int,
    val theme: String,
    val subTheme: String,
    val allowedTags: List<String> ? = null,
    val year: Int,
)
