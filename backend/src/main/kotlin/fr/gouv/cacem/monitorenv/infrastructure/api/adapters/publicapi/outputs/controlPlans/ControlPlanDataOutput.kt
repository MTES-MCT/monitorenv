package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.controlPlans

import fr.gouv.cacem.monitorenv.domain.entities.controlPlan.ControlPlanSubThemeEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlPlan.ControlPlanTagEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlPlan.ControlPlanThemeEntity

data class ControlPlanDataOutput(
    val themes: Map<Int, ControlPlanThemeDataOutput>,
    val subThemes: Map<Int, ControlPlanSubThemeDataOutput>,
    val tags: Map<Int, ControlPlanTagDataOutput>,
) {
    companion object {
        fun fromControlPlanEntities(
            themes: List<ControlPlanThemeEntity>,
            subThemes: List<ControlPlanSubThemeEntity>,
            tags: List<ControlPlanTagEntity>,
        ): ControlPlanDataOutput =
            ControlPlanDataOutput(
                themes = themes.associateBy({ it.id }, { ControlPlanThemeDataOutput.fromControlPlanThemeEntity(it) }),
                subThemes =
                    subThemes.associateBy(
                        { it.id },
                        { ControlPlanSubThemeDataOutput.fromControlPlanSubThemeEntity(it) },
                    ),
                tags = tags.associateBy({ it.id }, { ControlPlanTagDataOutput.fromControlPlanTagEntity(it) }),
            )
    }
}
