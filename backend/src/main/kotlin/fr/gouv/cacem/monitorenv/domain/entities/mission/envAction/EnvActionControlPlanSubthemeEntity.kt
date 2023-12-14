package fr.gouv.cacem.monitorenv.domain.entities.mission.envAction

data class EnvActionControlPlanSubThemeEntity(
    val subThemeId: Int,
    val tags: List<String>? = null,
    val theme: String? = null,
    val subTheme: String? = null,
)
