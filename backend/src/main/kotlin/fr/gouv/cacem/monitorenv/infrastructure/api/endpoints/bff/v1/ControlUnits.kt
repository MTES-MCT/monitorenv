package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.GetNearbyUnits
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.controlUnits.NearbyUnitOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.locationtech.jts.io.WKTReader
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.ZonedDateTime

@RestController("BffV1ControlUnits")
@RequestMapping("/bff/v1/control_units")
@Tag(description = "API Control units", name = "BFF.Control Units")
class ControlUnits(
    private val getNearbyUnits: GetNearbyUnits,
) {
    @GetMapping("/nearby")
    @Operation(summary = "Find all units that controls that intercept the given geometry")
    fun getNearbyUnit(
        @RequestParam(name = "geometry") pGeometry: String,
        @RequestParam(name = "from", required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        from: ZonedDateTime?,
        @RequestParam(name = "to", required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        to: ZonedDateTime?,
    ): List<NearbyUnitOutput> {
        val wktReader = WKTReader()
        val geometry = wktReader.read(pGeometry)
        val outputs =
            getNearbyUnits
                .execute(area = geometry, from = from, to = to)
                .map { NearbyUnitOutput.fromNearbyUnit(it) }
        return outputs
    }
}
