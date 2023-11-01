package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi

import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.GetLegacyControlUnits
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.LegacyControlUnitDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/control_units")
@Tag(name = "Legacy Control Units")
class ApiLegacyControlUnitsController(
    private val getLegacyControlUnits: GetLegacyControlUnits
) {
    @GetMapping("")
    @Operation(summary = "Get legacy control units")
    fun getControlResourcesController(): List<LegacyControlUnitDataOutput> {
        return getLegacyControlUnits.execute().map {
            LegacyControlUnitDataOutput.fromLegacyControlUnit(it)
        }
    }
}
