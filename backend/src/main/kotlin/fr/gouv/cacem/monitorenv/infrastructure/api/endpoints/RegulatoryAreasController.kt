package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints

import fr.gouv.cacem.monitorenv.domain.use_cases.crud.regulatoryAreas.GetRegulatoryAreaById
import fr.gouv.cacem.monitorenv.domain.use_cases.crud.regulatoryAreas.GetRegulatoryAreas
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs.*


import io.micrometer.core.instrument.MeterRegistry
import io.swagger.annotations.Api
import io.swagger.annotations.ApiOperation
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
    fun getRegulatoryAreasController(): List<RegulatoryAreaDataOutput> {
        val regulatoryAreas = getRegulatoryAreas.execute()

        return regulatoryAreas.map { RegulatoryAreaDataOutput.fromRegulatoryAreaEntity(it) }
    }
    @GetMapping("/{regulatoryAreaId}")
    @ApiOperation("Get operation by Id")
    fun getRegulatoryAreaByIdController(@PathParam("regulatoryArea id")
                        @PathVariable(name = "regulatoryAreaId")
                                        regulatoryAreaId: Int): RegulatoryAreaDataOutput {
        val regulatoryArea = getRegulatoryAreaById.execute(regulatoryAreaId = regulatoryAreaId)

        return RegulatoryAreaDataOutput.fromRegulatoryAreaEntity(regulatoryArea)
    }
}
