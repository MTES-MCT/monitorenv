package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff

import fr.gouv.cacem.monitorenv.domain.use_cases.controlResources.GetControlUnits
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.ControlUnitDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/bff/v1/control_units")
@Tag(name = "Control Units", description = "API control units")
class ControlUnitsController(
    private val getControlUnits: GetControlUnits,
) {

    @GetMapping("")
    @Operation(summary = "Get control units")
    fun getControlResourcesController(): List<ControlUnitDataOutput> {
        return getControlUnits.execute().map { ControlUnitDataOutput.fromControlUnitEntity(it) }
    }
}
