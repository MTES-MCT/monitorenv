package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.dashboard.ExtractArea
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.ExtractedAreaDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.ExtractedAreaDataOutput.Companion.fromExtractAreaEntity
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.locationtech.jts.io.WKTReader
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/bff/v1/dashboard")
@Tag(name = "BFF.Dashboard")
class Dashboard(private val extractArea: ExtractArea) {
    @GetMapping("/extract")
    @Operation(summary = "Extract all data that intercept the given geometry")
    fun get(
        @RequestParam(name = "geometry") pGeometry: String,
    ): ExtractedAreaDataOutput {
        val wktReader = WKTReader()
        val geometry = wktReader.read(pGeometry)
        return fromExtractAreaEntity(extractArea.execute(geometry = geometry))
    }
}
