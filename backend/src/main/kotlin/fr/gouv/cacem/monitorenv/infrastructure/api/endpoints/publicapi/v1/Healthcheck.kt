package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.healthcheck.GetHealthcheck
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.HealthcheckDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController("PublicApiV1Healthcheck")
@RequestMapping("/api/v1/healthcheck")
@Tag(description = "API for Healthcheck", name = "Public.Healthcheck")
class Healthcheck(
    private val getHealthcheck: GetHealthcheck,
) {
    @GetMapping("")
    @Operation(summary = "Get healtcheck for all resources")
    fun getHealthcheck(): HealthcheckDataOutput = HealthcheckDataOutput.fromHealth(getHealthcheck.execute())
}
