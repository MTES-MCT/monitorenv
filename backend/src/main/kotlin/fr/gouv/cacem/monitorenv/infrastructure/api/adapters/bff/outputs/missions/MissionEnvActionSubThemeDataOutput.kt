package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.missions

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionControlPlanSubThemeEntity

data class MissionEnvActionSubThemeDataOutput(
    val id: Int,
    val subTheme: String? = null,
    val theme: String? = null,
    val tags: List<String>? = null,
) {
    companion object {
        fun fromEnvActionControlPlanSubThemeEntity(
            envActionControlPlanSubThemeEntity: EnvActionControlPlanSubThemeEntity,
        ) =
            MissionEnvActionSubThemeDataOutput(
                id = envActionControlPlanSubThemeEntity.subThemeId,
                theme = envActionControlPlanSubThemeEntity.theme,
                subTheme = envActionControlPlanSubThemeEntity.subTheme,
                tags = envActionControlPlanSubThemeEntity.tags,
            )
    }
}
