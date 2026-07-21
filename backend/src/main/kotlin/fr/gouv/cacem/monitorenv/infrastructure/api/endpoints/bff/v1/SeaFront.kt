package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.facade.GetSeaFronts
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/bff/v1/sea-fronts")
@Tag(description = "API Sea front", name = "BFF.Seafronts")
class SeaFront(
    private val getAllSeaFronts: GetSeaFronts,
) {
    @GetMapping("")
    @Operation(summary = "Get all sea fronts")
    fun get(): List<String> = getAllSeaFronts.execute()
}
