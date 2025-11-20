package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.amps.GetAMPById
import fr.gouv.cacem.monitorenv.domain.use_cases.amps.GetAMPsByIds
import fr.gouv.cacem.monitorenv.domain.use_cases.amps.GetAllAMPs
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.AMPDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/bff/v1/amps")
@Tag(name = "BFF.AMP", description = "API des Aires Marines Protégées (AMP)")
class Amps(
    private val getAllAMPs: GetAllAMPs,
    private val getAMPsByIds: GetAMPsByIds,
    private val getAMPById: GetAMPById,
) {
    @GetMapping("")
    @Operation(summary = "Get AMPs")
    fun getAll(
        @RequestParam(name = "withGeometry") withGeometry: Boolean,
        @RequestParam(name = "zoom", required = false) zoom: Int?,
        @RequestParam(name = "bbox", required = false) bbox: List<Double>?,
    ): List<AMPDataOutput> {
        val amps = getAllAMPs.execute(withGeometry, zoom, bbox)
        return amps.map { AMPDataOutput.fromAMPEntity(it) }
    }

    @PostMapping("")
    @Operation(summary = "Get AMPs by ids")
    fun getAll(
        @RequestBody ids: List<Int>,
    ): List<AMPDataOutput> {
        val amps = getAMPsByIds.execute(ids)
        return amps.map { AMPDataOutput.fromAMPEntity(it) }
    }

    @GetMapping("/{ampId}")
    @Operation(summary = "Get AMP by Id")
    fun get(
        @PathParam("Amp id")
        @PathVariable(name = "ampId")
        ampId: Int,
    ): AMPDataOutput? =
        getAMPById.execute(id = ampId).let {
            AMPDataOutput.fromAMPEntity(it)
        }
}
