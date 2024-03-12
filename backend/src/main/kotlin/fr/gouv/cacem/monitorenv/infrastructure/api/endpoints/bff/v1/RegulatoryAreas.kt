package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetAllRegulatoryAreas
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetRegulatoryAreaById
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.RegulatoryAreaDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.RegulatoryAreasDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/bff/v1/regulatory")
@Tag(name = "BFF.Regulatory", description = "API regulatory layers")
class RegulatoryAreas(
    private val getAllRegulatoryAreas: GetAllRegulatoryAreas,
    private val getRegulatoryAreaById: GetRegulatoryAreaById,
) {

    @GetMapping("/{regulatoryAreaId}")
    @Operation(summary = "Get regulatory area by Id")
    fun get(
        @PathParam("regulatoryArea id")
        @PathVariable(name = "regulatoryAreaId")
        regulatoryAreaId: Int,
    ): RegulatoryAreaDataOutput {
        return RegulatoryAreaDataOutput.fromRegulatoryAreaEntity(
            getRegulatoryAreaById.execute(regulatoryAreaId = regulatoryAreaId),
        )
    }

    @GetMapping("")
    @Operation(summary = "Get regulatory Areas")
    fun getAll(): List<RegulatoryAreasDataOutput> {
        val regulatoryAreas = getAllRegulatoryAreas.execute()
        return regulatoryAreas.map { RegulatoryAreasDataOutput.fromRegulatoryAreaEntity(it) }
    }
}
