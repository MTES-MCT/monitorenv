package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetAllRegulatoryAreas
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetRegulatoryAreaById
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.RegulatoryAreaWithMetadataDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.web.bind.annotation.*

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
    ): RegulatoryAreaWithMetadataDataOutput? =
        getRegulatoryAreaById.execute(regulatoryAreaId = regulatoryAreaId)?.let {
            RegulatoryAreaWithMetadataDataOutput.fromRegulatoryAreaEntity(it)
        }

    @GetMapping("")
    @Operation(summary = "Get regulatory Areas")
    fun getAll(
        @RequestParam(name = "withGeometry") withGeometry: Boolean,
    ): List<RegulatoryAreaWithMetadataDataOutput> {
        val regulatoryAreas = getAllRegulatoryAreas.execute(withGeometry)
        return regulatoryAreas.map { RegulatoryAreaWithMetadataDataOutput.fromRegulatoryAreaEntity(it) }
    }
}
