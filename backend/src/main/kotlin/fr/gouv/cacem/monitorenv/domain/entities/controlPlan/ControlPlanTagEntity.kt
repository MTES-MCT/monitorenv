package fr.gouv.cacem.monitorenv.domain.entities.controlPlan

data class ControlPlanTagEntity(
    val id: Int,
    val tag: String,
    val themeId: Int,
)
