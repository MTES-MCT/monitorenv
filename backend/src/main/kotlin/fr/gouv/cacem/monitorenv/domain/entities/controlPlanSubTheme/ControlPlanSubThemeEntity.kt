package fr.gouv.cacem.monitorenv.domain.entities.controlPlanSubTheme

data class ControlPlanSubThemeEntity(
    val id: Int,
    val theme: String,
    val subTheme: String,
    val allowedTags: List<String> ? = null,
    val year: Int,
)
