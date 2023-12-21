package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.controlPlans

import fr.gouv.cacem.monitorenv.domain.entities.controlPlan.ControlPlanThemeEntity

data class ControlPlanThemeDataOutput(
    val id: Int,
    val theme: String,
) {
    companion object {
        fun fromControlPlanThemeEntity(
            controlPlanThemeEntity: ControlPlanThemeEntity,
        ): ControlPlanThemeDataOutput {
            return ControlPlanThemeDataOutput(
                id = controlPlanThemeEntity.id,
                theme = controlPlanThemeEntity.theme,
            )
        }
    }
}
