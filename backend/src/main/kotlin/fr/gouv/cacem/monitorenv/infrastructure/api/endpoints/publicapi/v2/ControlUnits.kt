package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.v2

import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.*
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.CreateOrUpdateControlUnitDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.BooleanDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.ControlUnitDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.FullControlUnitDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v2/control_units")
@Tag(name = "Public.Control Units")
class ControlUnits(
    private val archiveControlUnit: ArchiveControlUnit,
    private val createOrUpdateControlUnit: CreateOrUpdateControlUnit,
    private val canDeleteControlUnit: CanDeleteControlUnit,
    private val deleteControlUnit: DeleteControlUnit,
    private val getControlUnits: GetControlUnits,
    private val getControlUnitById: GetControlUnitById,
) {
    @PutMapping("/{controlUnitId}/archive")
    @Operation(summary = "Archive a control unit")
    fun archive(
        @PathParam("Control unit ID")
        @PathVariable(name = "controlUnitId")
        controlUnitId: Int,
    ) {
        archiveControlUnit.execute(controlUnitId)
    }

    @GetMapping("/{controlUnitId}/can_delete")
    @Operation(summary = "Can this control unit be deleted?")
    fun canDelete(
        @PathParam("Control unit ID")
        @PathVariable(name = "controlUnitId")
        controlUnitId: Int,
    ): BooleanDataOutput = canDeleteControlUnit.execute(controlUnitId).let { BooleanDataOutput.get(it) }

    @PostMapping("", consumes = ["application/json"])
    @Operation(summary = "Create a control unit")
    @ResponseStatus(HttpStatus.CREATED)
    fun create(
        @RequestBody
        createControlUnitDataInput: CreateOrUpdateControlUnitDataInput,
    ): ControlUnitDataOutput {
        val newControlUnit = createControlUnitDataInput.toControlUnit()
        val createdControlUnit = createOrUpdateControlUnit.execute(newControlUnit)

        return ControlUnitDataOutput.fromControlUnit(createdControlUnit)
    }

    @DeleteMapping("/{controlUnitId}")
    @Operation(summary = "Delete a control unit")
    fun delete(
        @PathParam("Control unit ID")
        @PathVariable(name = "controlUnitId")
        controlUnitId: Int,
    ) {
        deleteControlUnit.execute(controlUnitId)
    }

    @GetMapping("/{controlUnitId}")
    @Operation(summary = "Get a control unit by its ID")
    fun get(
        @PathParam("Control unit ID")
        @PathVariable(name = "controlUnitId")
        controlUnitId: Int,
    ): FullControlUnitDataOutput {
        val foundFullControlUnit = getControlUnitById.execute(controlUnitId)

        return FullControlUnitDataOutput.fromFullControlUnit(foundFullControlUnit)
    }

    @GetMapping("")
    @Operation(summary = "List control units")
    fun getAll(): List<FullControlUnitDataOutput> {
        val foundFullControlUnits = getControlUnits.execute()

        return foundFullControlUnits.map { FullControlUnitDataOutput.fromFullControlUnit(it) }
    }

    @PutMapping(value = ["/{controlUnitId}"], consumes = ["application/json"])
    @Operation(summary = "Update a control unit")
    fun update(
        @PathParam("Control unit ID")
        @PathVariable(name = "controlUnitId")
        controlUnitId: Int,
        @RequestBody
        updateControlUnitDataInput: CreateOrUpdateControlUnitDataInput,
    ): ControlUnitDataOutput {
        requireNotNull(updateControlUnitDataInput.id) { "`id` can't be null." }
        require(controlUnitId == updateControlUnitDataInput.id) {
            "Body ID ('${updateControlUnitDataInput.id}') doesn't match path ID ('$controlUnitId')."
        }

        val nextControlUnit = updateControlUnitDataInput.toControlUnit()
        val updatedControlUnit = createOrUpdateControlUnit.execute(nextControlUnit)

        return ControlUnitDataOutput.fromControlUnit(updatedControlUnit)
    }
}
