package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi

import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.CreateOrUpdateControlUnitResource
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.GetControlUnitResourceById
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.GetControlUnitResources
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.CreateOrUpdateControlUnitResourceDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.ControlUnitResourceDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/control_unit_resources")
@Tag(name = "Control Unit Resources")
class ApiControlUnitResourcesController(
    private val createOrUpdateControlUnitResource: CreateOrUpdateControlUnitResource,
    private val getControlUnitResources: GetControlUnitResources,
    private val getControlUnitResourceById: GetControlUnitResourceById,
) {
    @PostMapping("", consumes = ["application/json"])
    @Operation(summary = "Create a control unit resource")
    fun create(
        @RequestBody
        createControlUnitResourceDataInput: CreateOrUpdateControlUnitResourceDataInput,
    ): ControlUnitResourceDataOutput {
        val newControlUnitResource = createControlUnitResourceDataInput.toControlUnitResource()
        val createdControlUnitResource = createOrUpdateControlUnitResource.execute(newControlUnitResource)

        return ControlUnitResourceDataOutput.fromControlUnitResource(createdControlUnitResource)
    }

    @GetMapping("/{controlUnitResourceId}")
    @Operation(summary = "Get a control unit resource by its ID")
    fun get(
        @PathParam("Control unit resource ID")
        @PathVariable(name = "controlUnitResourceId")
        controlUnitResourceId: Int,
    ): ControlUnitResourceDataOutput {
        val foundFullControlUnitResource = getControlUnitResourceById.execute(controlUnitResourceId)

        return ControlUnitResourceDataOutput.fromFullControlUnitResource(foundFullControlUnitResource)
    }

    @GetMapping("")
    @Operation(summary = "List control unit resources")
    fun getAll(): List<ControlUnitResourceDataOutput> {
        return getControlUnitResources.execute().map { ControlUnitResourceDataOutput.fromFullControlUnitResource(it) }
    }

    @PutMapping(value = ["/{controlUnitResourceId}"], consumes = ["application/json"])
    @Operation(summary = "Update a control unit resource")
    fun update(
        @PathParam("Control unit resource ID")
        @PathVariable(name = "controlUnitResourceId")
        controlUnitResourceId: Int,
        @RequestBody
        updateControlUnitResourceDataInput: CreateOrUpdateControlUnitResourceDataInput,
    ): ControlUnitResourceDataOutput {
        if ((updateControlUnitResourceDataInput.id == null) || (controlUnitResourceId != updateControlUnitResourceDataInput.id)) {
            throw java.lang.IllegalArgumentException("Unable to find (and update) control unit resource with ID = ${updateControlUnitResourceDataInput.id}.")
        }

        val controlUnitResource = updateControlUnitResourceDataInput.toControlUnitResource()
        val updatedControlUnitResource = createOrUpdateControlUnitResource.execute(controlUnitResource)

        return ControlUnitResourceDataOutput.fromControlUnitResource(updatedControlUnitResource)
    }
}
