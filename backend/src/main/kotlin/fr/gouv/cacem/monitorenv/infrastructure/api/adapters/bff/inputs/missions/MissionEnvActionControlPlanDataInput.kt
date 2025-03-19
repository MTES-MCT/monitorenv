package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.missions

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionControlPlanEntity

data class MissionEnvActionControlPlanDataInput(
    val subThemeIds: List<Int>? = emptyList(),
    val tagIds: List<Int>? = emptyList(),
    val themeId: Int? = null,
) {
    fun toEnvActionControlPlanEntity(): EnvActionControlPlanEntity =
        EnvActionControlPlanEntity(
            subThemeIds = this.subThemeIds,
            tagIds = this.tagIds,
            themeId = this.themeId,
        )
}
