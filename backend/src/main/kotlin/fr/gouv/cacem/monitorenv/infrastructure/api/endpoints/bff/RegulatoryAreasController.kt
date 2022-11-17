package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetRegulatoryAreaById
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetRegulatoryAreas
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs.RegulatoryAreaDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.n52.jackson.datatype.jts.JtsModule
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import javax.websocket.server.PathParam

@RestController
@RequestMapping("/bff/v1/regulatory")
@Tag(name = "Regulatory", description = "API regulatory layers")
class RegulatoryAreasController(
  private val getRegulatoryAreas: GetRegulatoryAreas,
  private val getRegulatoryAreaById: GetRegulatoryAreaById,
  private val objectMapper: ObjectMapper,
) {

  @GetMapping("")
  @Operation(summary = "Get regulatory Areas")
  fun getRegulatoryAreasController(): String {
    val regulatoryAreas = getRegulatoryAreas.execute()
    val regulatoryAreaEntities = regulatoryAreas.map { RegulatoryAreaDataOutput.fromRegulatoryAreaEntity(it) }
    val mapper = ObjectMapper()
    mapper.registerModule(JtsModule())
    return mapper.writeValueAsString(regulatoryAreaEntities)
  }

  @GetMapping("/{regulatoryAreaId}")
  @Operation(summary = "Get regulatory area by Id")
  fun getRegulatoryAreaByIdController(
    @PathParam("regulatoryArea id")
    @PathVariable(name = "regulatoryAreaId")
    regulatoryAreaId: Int
  ): String {
    val regulatoryArea = getRegulatoryAreaById.execute(regulatoryAreaId = regulatoryAreaId)
    val mapper = ObjectMapper()
    mapper.registerModule(JtsModule())
    return mapper.writeValueAsString(regulatoryArea)
  }
}