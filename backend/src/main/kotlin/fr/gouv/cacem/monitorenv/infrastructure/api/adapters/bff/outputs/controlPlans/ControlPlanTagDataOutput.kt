package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.controlPlans

import fr.gouv.cacem.monitorenv.domain.entities.controlPlan.ControlPlanTagEntity

data class ControlPlanTagDataOutput(
    val id: Int,
    val tag: String,
    val themeId: Int,
) {
    companion object {
        fun fromControlPlanTagEntity(controlPlanTag: ControlPlanTagEntity) =
            ControlPlanTagDataOutput(
                id = controlPlanTag.id,
                tag = controlPlanTag.tag,
                themeId = controlPlanTag.themeId,
            )
    }
}
