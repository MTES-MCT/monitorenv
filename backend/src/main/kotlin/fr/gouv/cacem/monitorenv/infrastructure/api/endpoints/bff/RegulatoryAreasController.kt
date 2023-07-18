package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff

import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetRegulatoryAreaById
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetRegulatoryAreas
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.RegulatoryAreaDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/bff/v1/regulatory")
@Tag(name = "Regulatory", description = "API regulatory layers")
class RegulatoryAreasController(
    private val getRegulatoryAreas: GetRegulatoryAreas,
    private val getRegulatoryAreaById: GetRegulatoryAreaById,
) {

    @GetMapping("")
    @Operation(summary = "Get regulatory Areas")
    fun getRegulatoryAreasController(): List<RegulatoryAreaDataOutput> {
        val regulatoryAreas = getRegulatoryAreas.execute()
        return regulatoryAreas.map { RegulatoryAreaDataOutput.fromRegulatoryAreaEntity(it) }
    }

    @GetMapping("/{regulatoryAreaId}")
    @Operation(summary = "Get regulatory area by Id")
    fun getRegulatoryAreaByIdController(
        @PathParam("regulatoryArea id")
        @PathVariable(name = "regulatoryAreaId")
        regulatoryAreaId: Int,
    ): RegulatoryAreaDataOutput {
        return RegulatoryAreaDataOutput.fromRegulatoryAreaEntity(
            getRegulatoryAreaById.execute(regulatoryAreaId = regulatoryAreaId),
        )
    }
}
