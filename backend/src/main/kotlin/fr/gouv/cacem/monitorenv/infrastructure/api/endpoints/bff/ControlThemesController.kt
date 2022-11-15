package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.use_cases.controlThemes.GetControlThemeById
import fr.gouv.cacem.monitorenv.domain.use_cases.controlThemes.GetControlThemes
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs.ControlThemeDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.n52.jackson.datatype.jts.JtsModule
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import javax.websocket.server.PathParam

@RestController
@RequestMapping("/bff/v1/controlthemes")
@Tag(name = "Control Themes", description = "API control themes")
class ControlThemesController(
  private val getControlThemes: GetControlThemes,
  private val getControlThemeById: GetControlThemeById
) {

  @GetMapping("")
  @Operation(summary = "Get control themes")
  fun getControlThemesController(): String {
    val controlThemes = getControlThemes.execute()
    val controlThemeEntities = controlThemes.map { ControlThemeDataOutput.fromControlThemeEntity(it) }
    val mapper = ObjectMapper()
    mapper.registerModule(JtsModule())
    return mapper.writeValueAsString(controlThemeEntities)
  }

  @GetMapping("/{controlThemeId}")
  @Operation(summary = "Get regulatory area by Id")
  fun getControlThemeByIdController(
    @PathParam("controlTheme id")
    @PathVariable(name = "controlThemeId")
    controlThemeId: Int
  ): String {
    val controlTheme = getControlThemeById.execute(controlThemeId = controlThemeId)
    val mapper = ObjectMapper()
    mapper.registerModule(JtsModule())
    return mapper.writeValueAsString(controlTheme)
  }
}