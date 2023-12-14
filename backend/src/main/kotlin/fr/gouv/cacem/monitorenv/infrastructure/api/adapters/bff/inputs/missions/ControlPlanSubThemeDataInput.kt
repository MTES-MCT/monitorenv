package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.missions

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionControlPlanSubThemeEntity

data class ControlPlanSubThemeDataInput(
    val id: Int,
    val tags: List<String> ? = null,
) {
    fun toEnvActionControlPlanSubThemeEntity(): EnvActionControlPlanSubThemeEntity {
        return EnvActionControlPlanSubThemeEntity(
            subThemeId = this.id,
            tags = this.tags,
        )
    }
}
