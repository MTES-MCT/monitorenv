package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff

import fr.gouv.cacem.monitorenv.domain.use_cases.controlPlanThemes.GetControlPlanThemesByYear
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.ControlPlanThemeDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/bff/v1/controlplanthemes")
@Tag(name = "Control Plan Themes", description = "API thématiques du plan de contrôle")
class ControlPlanThemesController(
    private val getControlPlanThemesByYear: GetControlPlanThemesByYear,
) {

    @GetMapping("/{year}")
    @Operation(summary = "Get control plan (sub)themes and allowed tags for a given year")
    fun getAll(
        @PathParam("validity year of the control plan themes")
        @PathVariable(name = "year")
        year: Int,
    ): List<ControlPlanThemeDataOutput> {
        val controlPlanThemes = getControlPlanThemesByYear.execute(year)
        return controlPlanThemes.map { ControlPlanThemeDataOutput.fromControlPlanThemeEntity(it) }
    }
}
