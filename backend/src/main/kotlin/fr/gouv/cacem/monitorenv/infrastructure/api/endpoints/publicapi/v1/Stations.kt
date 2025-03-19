package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.station.*
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.CreateOrUpdateStationDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.BooleanDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.FullStationDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.StationDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/stations")
@Tag(name = "Public.Stations", description = "API stations")
class ApiStationsController(
    private val canDeleteStation: CanDeleteStation,
    private val createOrUpdateStation: CreateOrUpdateStation,
    private val deleteStation: DeleteStation,
    private val getStations: GetStations,
    private val getStationById: GetStationById,
) {
    @GetMapping("/{stationId}/can_delete")
    @Operation(summary = "Can this station be deleted?")
    fun canDelete(
        @PathParam("Station ID")
        @PathVariable(name = "stationId")
        stationId: Int,
    ): BooleanDataOutput = canDeleteStation.execute(stationId).let { BooleanDataOutput.get(it) }

    @PostMapping("", consumes = ["application/json"])
    @Operation(summary = "Create a station")
    @ResponseStatus(HttpStatus.CREATED)
    fun create(
        @RequestBody
        createBaseDataInput: CreateOrUpdateStationDataInput,
    ): StationDataOutput {
        val newStation = createBaseDataInput.toStation()
        val createdBase = createOrUpdateStation.execute(newStation)

        return StationDataOutput.fromStation(createdBase)
    }

    @DeleteMapping("/{stationId}")
    @Operation(summary = "Delete a station")
    fun delete(
        @PathParam("Station ID")
        @PathVariable(name = "stationId")
        stationId: Int,
    ) {
        deleteStation.execute(stationId)
    }

    @GetMapping("/{stationId}")
    @Operation(summary = "Get a station by its ID")
    fun get(
        @PathParam("Station ID")
        @PathVariable(name = "stationId")
        stationId: Int,
    ): FullStationDataOutput {
        val foundFullStation = getStationById.execute(stationId)

        return FullStationDataOutput.fromFullStation(foundFullStation)
    }

    @GetMapping("")
    @Operation(summary = "List stations")
    fun getAll(): List<FullStationDataOutput> {
        val foundFullStations = getStations.execute()

        return foundFullStations.map { FullStationDataOutput.fromFullStation(it) }
    }

    @PutMapping(value = ["/{stationId}"], consumes = ["application/json"])
    @Operation(summary = "Update a station")
    fun update(
        @PathParam("Station ID")
        @PathVariable(name = "stationId")
        stationId: Int,
        @RequestBody
        updateBaseDataInput: CreateOrUpdateStationDataInput,
    ): StationDataOutput {
        requireNotNull(updateBaseDataInput.id) { "`id` can't be null." }
        require(stationId == updateBaseDataInput.id) {
            "Body ID ('${updateBaseDataInput.id}') doesn't match path ID ('$stationId')."
        }

        val nextStation = updateBaseDataInput.toStation()
        val updatedStation = createOrUpdateStation.execute(nextStation)

        return StationDataOutput.fromStation(updatedStation)
    }
}
