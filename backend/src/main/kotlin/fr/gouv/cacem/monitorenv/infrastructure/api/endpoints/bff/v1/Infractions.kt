package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.actions.GetEnvActionsByMmsi
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.actions.EnvActionDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/bff/v1/infractions")
@Tag(name = "BFF.Infractions")
class Infractions(
    private val getEnvActionsByMmsi: GetEnvActionsByMmsi,
) {
    @GetMapping("/{mmsi}")
    @Operation(summary = "get infractions by mmsi")
    fun getAll(
        @PathVariable(name = "mmsi") mmsi: String,
    ): List<EnvActionDataOutput> =
        getEnvActionsByMmsi.execute(mmsi).map {
            EnvActionDataOutput.fromEnvActionEntity(it, null)
        }
}
