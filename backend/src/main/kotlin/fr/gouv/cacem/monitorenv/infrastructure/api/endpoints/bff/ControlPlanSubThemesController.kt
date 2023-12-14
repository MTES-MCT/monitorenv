package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff

import fr.gouv.cacem.monitorenv.domain.use_cases.ControlPlanSubThemes.GetControlPlanSubThemesByYear
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.ControlPlanSubThemeDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/bff/v1/controlPlanSubThemes")
@Tag(name = "Control Plan Sub Themes", description = "API des sous thématiques des plan de contrôle")
class ControlPlanSubThemesController(
    private val getControlPlanSubThemesByYear: GetControlPlanSubThemesByYear,
) {

    @GetMapping("/{year}")
    @Operation(summary = "Get control plan (sub)themes and allowed tags for a given year")
    fun getAll(
        @PathParam("validity year of the control plan themes")
        @PathVariable(name = "year")
        year: Int,
    ): List<ControlPlanSubThemeDataOutput> {
        val ControlPlanSubThemes = getControlPlanSubThemesByYear.execute(year)
        return ControlPlanSubThemes.map { ControlPlanSubThemeDataOutput.fromControlPlanSubThemeEntity(it) }
    }
}
