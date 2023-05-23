package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff

import fr.gouv.cacem.monitorenv.domain.use_cases.healthcheck.GetHealthcheck
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs.HealthDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/bff/v1/healthcheck")
@Tag(description = "API for Healthcheck", name = "Healthcheck")
class HealthcheckController(
    private val getHealthcheck: GetHealthcheck,
) {

    @GetMapping("")
    @Operation(summary = "Get healtcheck of regulatory areas and missions")
    fun getHealthcheck(): HealthDataOutput {
        return HealthDataOutput.fromHealth(getHealthcheck.execute())
    }
}
