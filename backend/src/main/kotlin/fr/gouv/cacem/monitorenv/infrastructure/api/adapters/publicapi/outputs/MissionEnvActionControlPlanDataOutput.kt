package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionControlPlanEntity

data class MissionEnvActionControlPlanDataOutput(
    val themeId: Int? = null,
    val subThemeIds: List<Int>? = emptyList(),
    val tagIds: List<Int>? = emptyList(),
) {
    companion object {
        fun fromEnvActionControlPlanEntity(envActionControlPlanEntity: EnvActionControlPlanEntity) =
            MissionEnvActionControlPlanDataOutput(
                subThemeIds = envActionControlPlanEntity.subThemeIds,
                tagIds = envActionControlPlanEntity.tagIds,
                themeId = envActionControlPlanEntity.themeId,
            )
    }
}
