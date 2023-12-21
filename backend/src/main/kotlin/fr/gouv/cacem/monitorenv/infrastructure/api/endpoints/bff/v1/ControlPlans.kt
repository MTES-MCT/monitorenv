package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.controlPlan.GetControlPlans
import fr.gouv.cacem.monitorenv.domain.use_cases.controlPlan.GetControlPlansByYear
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.controlPlans.ControlPlanDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/bff/v1/control_plans")
@Tag(
    name = "Control Plan Themes, SubThemes and tags",
    description = "API des sous thématiques des plan de contrôle",
)
class ControlPlansController(
    private val getControlPlans: GetControlPlans,
    private val getControlPlansByYear: GetControlPlansByYear,
) {

    @GetMapping("")
    @Operation(summary = "Get control plan themes, subthemes and tags and allowed tags")
    fun getAll(): ControlPlanDataOutput {
        val controlPlan = getControlPlans.execute()
        return ControlPlanDataOutput.fromControlPlanEntities(
            themes = controlPlan.first,
            subThemes = controlPlan.second,
            tags = controlPlan.third,
        )
    }

    @GetMapping("/{year}")
    @Operation(
        summary =
        "Get control plan themes, subthemes and tags and allowed tags for a given year",
    )
    fun getControlPlansByYear(
        @PathParam("validity year of the control plan themes")
        @PathVariable(name = "year")
        year: Int,
    ): ControlPlanDataOutput {
        val controlPlan = getControlPlansByYear.execute(year)
        return ControlPlanDataOutput.fromControlPlanEntities(
            themes = controlPlan.first,
            subThemes = controlPlan.second,
            tags = controlPlan.third,
        )
    }
}
