package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.lastPositions.GetLastPositions
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.lastPositions.LastPositionOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.lastPositions.LastPositionOutput.Companion.toLastPositionOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/bff/v1/last_positions")
@Tag(name = "APIs for Vessel's last positions")
class LastPositions(
    private val getLastPositions: GetLastPositions,
) {
    @GetMapping("/{shipId}")
    @Operation(summary = "Get last position of vessel by ship id")
    fun getLastPositionsByShipId(
        @PathParam("Ship ID")
        @PathVariable(name = "shipId")
        shipId: Int,
    ): List<LastPositionOutput> = getLastPositions.execute(shipId).map { toLastPositionOutput(it) }
}
