package fr.gouv.cacem.monitorenv.domain.entities.mission.envAction

data class EnvActionControlPlanEntity(
    val themeId: Int,
    val subThemeIds: List<Int>? = emptyList(),
    val tagIds: List<Int>? = emptyList(),
)
