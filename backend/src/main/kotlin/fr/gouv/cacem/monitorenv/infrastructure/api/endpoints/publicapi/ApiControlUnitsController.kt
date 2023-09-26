package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi

import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.CreateOrUpdateControlUnit
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.GetControlUnitById
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.GetControlUnits
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.CreateOrUpdateControlUnitDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.ControlUnitDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.FullControlUnitDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v2/control_units")
@Tag(name = "Control Units")
class ApiControlUnitsController(
    private val createOrUpdateControlUnit: CreateOrUpdateControlUnit,
    private val getControlUnits: GetControlUnits,
    private val getControlUnitById: GetControlUnitById,
) {
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
            "Body ID ('${updateControlUnitDataInput.id}') doesn't match path ID ('${controlUnitId}')."
        }

        val nextControlUnit = updateControlUnitDataInput.toControlUnit()
        val updatedControlUnit = createOrUpdateControlUnit.execute(nextControlUnit)

        return ControlUnitDataOutput.fromControlUnit(updatedControlUnit)
    }
}
