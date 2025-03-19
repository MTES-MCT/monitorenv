package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.GetLegacyControlUnits
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.LegacyControlUnitDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/control_units")
@Tag(name = "Public.Legacy Control Units")
class LegacyControlUnits(
    private val getLegacyControlUnits: GetLegacyControlUnits,
) {
    @GetMapping("")
    @Operation(summary = "Get legacy control units")
    fun getAll(): List<LegacyControlUnitDataOutput> =
        getLegacyControlUnits.execute().map {
            LegacyControlUnitDataOutput.fromLegacyControlUnit(it)
        }
}
