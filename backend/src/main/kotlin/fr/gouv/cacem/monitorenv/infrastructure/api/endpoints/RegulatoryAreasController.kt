package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryAreas.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.crud.regulatoryAreas.GetRegulatoryAreaById
import fr.gouv.cacem.monitorenv.domain.use_cases.crud.regulatoryAreas.GetRegulatoryAreas
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs.*


import io.micrometer.core.instrument.MeterRegistry
import io.swagger.annotations.Api
import io.swagger.annotations.ApiOperation
import org.n52.jackson.datatype.jts.JtsModule
import org.springframework.web.bind.annotation.*
import javax.websocket.server.PathParam

@RestController
@RequestMapping("/bff/v1/regulatory")
@Api(description = "API regulatory layers")
class RegulatoryAreasController(
  private val getRegulatoryAreas: GetRegulatoryAreas,
  private val getRegulatoryAreaById: GetRegulatoryAreaById,
  meterRegistry: MeterRegistry) {

    @GetMapping("")
    @ApiOperation("Get regulatory Areas")
    fun getRegulatoryAreasController(): String {
        val regulatoryAreas = getRegulatoryAreas.execute()

         val regulatoryAreaEntities = regulatoryAreas.map { RegulatoryAreaDataOutput.fromRegulatoryAreaEntity(it) }
      val mapper = ObjectMapper()
      mapper.registerModule(JtsModule())
      return mapper.writeValueAsString(regulatoryAreaEntities)
    }
    @GetMapping("/{regulatoryAreaId}")
    @ApiOperation("Get operation by Id")
    fun getRegulatoryAreaByIdController(@PathParam("regulatoryArea id")
                        @PathVariable(name = "regulatoryAreaId")
                                        regulatoryAreaId: Int): String {
        val regulatoryArea = getRegulatoryAreaById.execute(regulatoryAreaId = regulatoryAreaId)
        val mapper = ObjectMapper()
        mapper.registerModule(JtsModule())
        return mapper.writeValueAsString(regulatoryArea)
    }
}
