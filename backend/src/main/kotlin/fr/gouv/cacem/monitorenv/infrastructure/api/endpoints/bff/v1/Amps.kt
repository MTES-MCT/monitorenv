package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.SearchFilters
import fr.gouv.cacem.monitorenv.domain.use_cases.amps.GetAMPById
import fr.gouv.cacem.monitorenv.domain.use_cases.amps.GetAllAMPs
import fr.gouv.cacem.monitorenv.domain.use_cases.amps.GetAllAMPsByIds
import fr.gouv.cacem.monitorenv.domain.use_cases.amps.GetAllAmpsTiles
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.amps.AmpByIdsDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.amps.AMPDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
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
    private val getAllAMPByIds: GetAllAMPsByIds,
    private val getAllAmpsTiles: GetAllAmpsTiles,
    private val getAMPById: GetAMPById,
) {
    @GetMapping("/{id}")
    @Operation(summary = "Get AMP by id")
    fun getAll(
        @PathVariable
        @PathParam("AMP id")
        id: Int,
    ): AMPDataOutput = AMPDataOutput.fromAMPEntity(getAMPById.execute(id))

    @GetMapping("")
    @Operation(summary = "Get AMPs")
    fun getAll(
        @Parameter(description = "Search query")
        @RequestParam(name = "searchQuery", required = false)
        searchQuery: String?,
        @Parameter(description = "Extent")
        @RequestParam(name = "extent", required = false) extent: List<Double>?,
    ): List<AMPDataOutput> {
        val amps = getAllAMPs.execute(SearchFilters(query = searchQuery, extent = extent))
        return amps.map { AMPDataOutput.fromAMPEntity(it, withGeom = false) }
    }

    @PostMapping("")
    @Operation(summary = "Get AMPs by ids")
    fun getAll(
        @RequestBody
        body: AmpByIdsDataInput,
    ): List<AMPDataOutput> = getAllAMPByIds.execute(body.ids, body.axis).map { AMPDataOutput.fromAMPEntity(it) }

    @GetMapping(value = ["/tiles/{z}/{x}/{y}"], produces = ["application/x-protobuf"])
    @Operation(summary = "Get Amps tiles")
    fun getAllTiles(
        @Parameter(description = "Search query")
        @RequestParam(name = "searchQuery", required = false)
        searchQuery: String?,
        @Parameter(description = "Extent")
        @RequestParam(name = "extent", required = false) extent: List<Double>?,
        @PathVariable x: Int,
        @PathVariable y: Int,
        @PathVariable z: Int,
    ): ByteArray =
        getAllAmpsTiles.execute(
            filters =
                SearchFilters(query = searchQuery, extent = extent),
            x = x,
            y = y,
            z = z,
        )
}
