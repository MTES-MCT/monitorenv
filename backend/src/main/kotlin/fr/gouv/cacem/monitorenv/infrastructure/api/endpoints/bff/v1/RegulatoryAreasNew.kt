package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaNewEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetAllNewRegulatoryAreas
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.regulatoryArea.RegulatoryAreasDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/bff/regulatory-areas")
@Tag(name = "BFF.RegulatoryAreas", description = "API regulatory layers")
class RegulatoryAreasNew(
    private val getAllNewRegulatoryAreas: GetAllNewRegulatoryAreas,
) {
    @GetMapping("")
    @Operation(summary = "Get regulatory Areas")
    fun getAll(): List<RegulatoryAreasDataOutput> {
        val regulatoryAreas = getAllNewRegulatoryAreas.execute()
        return regulatoryAreas.map { RegulatoryAreasDataOutput.fromRegulatoryAreaEntity(it as RegulatoryAreaNewEntity) }
    }
}
