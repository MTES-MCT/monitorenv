package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff

import fr.gouv.cacem.monitorenv.domain.use_cases.controlResources.GetLegacyControlUnits
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.LegacyControlUnitDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/bff/v1/legacy_control_units")
@Tag(name = "Control Units", description = "API control units")
class LegacyControlUnitsController(
    private val getLegacyControlUnits: GetLegacyControlUnits,
) {
    @GetMapping("")
    @Operation(summary = "Get legacy control units")
    fun getControlResourcesController(): List<LegacyControlUnitDataOutput> {
        return getLegacyControlUnits.execute().map { LegacyControlUnitDataOutput.fromControlUnitEntity(it) }
    }
}
