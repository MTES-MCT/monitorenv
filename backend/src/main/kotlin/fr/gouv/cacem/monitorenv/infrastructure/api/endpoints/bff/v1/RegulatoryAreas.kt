package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetAllRegulatoryAreas
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetRegulatoryAreaById
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetRegulatoryAreasByIds
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.RegulatoryAreaWithMetadataDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/bff/v1/regulatory")
@Tag(name = "BFF.Regulatory", description = "API regulatory layers")
class RegulatoryAreas(
    private val getAllRegulatoryAreas: GetAllRegulatoryAreas,
    private val getRegulatoryAreaById: GetRegulatoryAreaById,
    private val getRegulatoryAreasByIds: GetRegulatoryAreasByIds,
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
        @RequestParam(name = "zoom", required = false) zoom: Int?,
        @RequestParam(name = "bbox", required = false) bbox: List<Double>?,
    ): List<RegulatoryAreaWithMetadataDataOutput> {
        val regulatoryAreas = getAllRegulatoryAreas.execute(withGeometry, zoom, bbox)
        return regulatoryAreas.map { RegulatoryAreaWithMetadataDataOutput.fromRegulatoryAreaEntity(it) }
    }

    @PostMapping("")
    @Operation(summary = "Get regulatory Areas by ids")
    fun getAll(
        @RequestBody ids: List<Int>,
    ): List<RegulatoryAreaWithMetadataDataOutput> =
        getRegulatoryAreasByIds
            .execute(ids)
            .map { RegulatoryAreaWithMetadataDataOutput.fromRegulatoryAreaEntity(it) }
}
