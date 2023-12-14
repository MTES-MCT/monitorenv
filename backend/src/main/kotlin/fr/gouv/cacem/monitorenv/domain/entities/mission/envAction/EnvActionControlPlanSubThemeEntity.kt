package fr.gouv.cacem.monitorenv.domain.entities.mission.envAction

data class EnvActionControlPlanSubThemeEntity(
    val subThemeId: Int,
    val tags: List<String>,
    val theme: String,
    val subTheme: String,
)
