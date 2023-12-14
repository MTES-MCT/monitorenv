package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff

import fr.gouv.cacem.monitorenv.domain.use_cases.controlPlan.GetControlPlansByYear
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.ControlPlanDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/bff/v1/control_plans")
@Tag(name = "Control Plan Themes, SubThemes and tags", description = "API des sous thématiques des plan de contrôle")
class ControlPlansController(
    private val getControlPlansByYear: GetControlPlansByYear,
) {

    @GetMapping("/{year}")
    @Operation(summary = "Get control plan themes, subthemes and tags and allowed tags for a given year")
    fun getAll(
        @PathParam("validity year of the control plan themes")
        @PathVariable(name = "year")
        year: Int,
    ): List<ControlPlanDataOutput> {
        val controlPlanSubThemes = getControlPlansByYear.execute(year)
        return controlPlanSubThemes.map { ControlPlanDataOutput.fromControlPlanEntity(it) }
    }
}
