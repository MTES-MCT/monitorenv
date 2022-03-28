package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryAreas.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.crud.regulatoryAreas.GetRegulatoryAreaById
import fr.gouv.cacem.monitorenv.domain.use_cases.crud.regulatoryAreas.GetRegulatoryAreas
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs.*


import io.micrometer.core.instrument.MeterRegistry
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.n52.jackson.datatype.jts.JtsModule
import org.springframework.web.bind.annotation.*
import javax.websocket.server.PathParam

@RestController
@RequestMapping("/bff/v1/regulatory")
@Tag(name = "Regulatory", description = "API regulatory layers")
class RegulatoryAreasController(
  private val getRegulatoryAreas: GetRegulatoryAreas,
  private val getRegulatoryAreaById: GetRegulatoryAreaById,
  meterRegistry: MeterRegistry
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
  @Operation(summary = "Get operation by Id")
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
