package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi

import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.CreateOrUpdateControlUnit
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.GetControlUnitById
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.GetControlUnits
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.CreateOrUpdateControlUnitDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.ControlUnitDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/control_units")
@Tag(name = "Control Units")
class ApiControlUnitsController(
    private val createOrUpdateControlUnit: CreateOrUpdateControlUnit,
    private val getControlUnits: GetControlUnits,
    private val getControlUnitById: GetControlUnitById,
) {
    @PostMapping("", consumes = ["application/json"])
    @Operation(summary = "Create a control unit")
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
    ): ControlUnitDataOutput {
        val foundFullControlUnit = getControlUnitById.execute(controlUnitId)

        return ControlUnitDataOutput.fromFullControlUnit(foundFullControlUnit)
    }

    @GetMapping("")
    @Operation(summary = "List control units")
    fun getAll(): List<ControlUnitDataOutput> {
        val foundFullControlUnits = getControlUnits.execute()

        return foundFullControlUnits.map { ControlUnitDataOutput.fromFullControlUnit(it) }
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
        if ((updateControlUnitDataInput.id == null) || (controlUnitId != updateControlUnitDataInput.id)) {
            throw java.lang.IllegalArgumentException("Unable to find (and update) control unit with ID = ${updateControlUnitDataInput.id}.")
        }

        val nextControlUnit = updateControlUnitDataInput.toControlUnit()
        val updatedControlUnit = createOrUpdateControlUnit.execute(nextControlUnit)

        return ControlUnitDataOutput.fromControlUnit(updatedControlUnit)
    }
}
