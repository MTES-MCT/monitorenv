package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.lastPositions.GetPositions
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.positions.PositionOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.positions.PositionOutput.Companion.toLastPositionOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.ZonedDateTime

@RestController
@RequestMapping("/bff/v1/positions")
@Tag(name = "APIs for Vessel's positions")
class Positions(
    private val getPositions: GetPositions,
) {
    @GetMapping("/{mmsi}")
    @Operation(summary = "Get positions of vessel by mmsi and date range")
    fun getPositionsByMmsi(
        @PathParam("MMSI")
        @PathVariable(name = "mmsi")
        mmsi: Int,
        @Parameter(description = "Lower limit of the date of positions")
        @RequestParam(name = "from")
        from: ZonedDateTime,
        @Parameter(description = "Upper limit of the date of positions")
        @RequestParam(name = "to")
        to: ZonedDateTime,
    ): List<PositionOutput> = getPositions.execute(mmsi, from, to).map { toLastPositionOutput(it) }
}
