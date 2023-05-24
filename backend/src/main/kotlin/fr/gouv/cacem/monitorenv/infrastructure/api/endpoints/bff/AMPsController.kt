package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.use_cases.amps.GetAMPs
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs.AMPDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.n52.jackson.datatype.jts.JtsModule
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/bff/v1/amps")
@Tag(name = "AMP", description = "API des Aires Marines Protégées (AMP)")
class AMPsController (
  private val getAMPs: GetAMPs,
  private val objectMapper: ObjectMapper
    ) {

  @GetMapping("")
  @Operation(summary = "Get AMPs")
  fun getAMPsController(): String {
    val amps = getAMPs.execute()
    val ampEntities = amps.map { AMPDataOutput.fromAMPEntity(it) }
    // FIXME: fails when using objectMapper from MapperConfiguration
    val mapper = ObjectMapper()
    mapper.registerModule(JtsModule())
    return mapper.writeValueAsString(ampEntities)
  }
}