package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.controlThemes.GetAllControlThemes
import fr.gouv.cacem.monitorenv.domain.use_cases.controlThemes.GetControlThemeById
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.ControlThemeDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@Deprecated("Use ControlPlanSubThemesController instead")
@RestController
@RequestMapping("/bff/v1/controlthemes")
@Tag(name = "BFF.Control Themes", description = "API control themes")
class ControlThemes(
    private val getAllControlThemes: GetAllControlThemes,
    private val getControlThemeById: GetControlThemeById,
) {

    @GetMapping("/{controlThemeId}")
    @Operation(summary = "Get regulatory area by Id")
    fun get(
        @PathParam("controlTheme id")
        @PathVariable(name = "controlThemeId")
        controlThemeId: Int,
    ): ControlThemeDataOutput {
        val controlTheme = getControlThemeById.execute(controlThemeId = controlThemeId)
        return ControlThemeDataOutput.fromControlThemeEntity(controlTheme)
    }

    @GetMapping("")
    @Operation(summary = "Get control themes")
    fun getAll(): List<ControlThemeDataOutput> {
        val controlThemes = getAllControlThemes.execute()
        return controlThemes.map { ControlThemeDataOutput.fromControlThemeEntity(it) }
    }
}
