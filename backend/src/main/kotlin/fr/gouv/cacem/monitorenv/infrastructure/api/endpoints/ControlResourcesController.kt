package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.use_cases.crud.controlResources.GetControlResources
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs.*


import io.micrometer.core.instrument.MeterRegistry
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.n52.jackson.datatype.jts.JtsModule
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/bff/v1/controlresources")
@Tag(name = "Control Resources", description = "API control resources")
class ControlResourcesController(
  private val getControlResources: GetControlResources,
  meterRegistry: MeterRegistry
) {

  @GetMapping("")
  @Operation(summary = "Get control resources")
  fun getControlResourcesController(): String {
    val controlResources = getControlResources.execute()
    val controlResourceEntities = controlResources.map { ControlResourceDataOutput.fromControlResourceEntity(it) }
    val mapper = ObjectMapper()
    mapper.registerModule(JtsModule())
    return mapper.writeValueAsString(controlResourceEntities)
  }
}
