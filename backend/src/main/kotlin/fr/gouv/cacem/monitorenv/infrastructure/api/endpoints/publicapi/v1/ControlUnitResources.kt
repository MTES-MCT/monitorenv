package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.*
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.CreateOrUpdateControlUnitResourceDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.BooleanDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.ControlUnitResourceDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.FullControlUnitResourceDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/control_unit_resources")
@Tag(name = "Public.Control Unit Resources")
class ControlUnitResources(
    private val archiveControlUnitResource: ArchiveControlUnitResource,
    private val canDeleteControlUnitResource: CanDeleteControlUnitResource,
    private val createOrUpdateControlUnitResource: CreateOrUpdateControlUnitResource,
    private val deleteControlUnitResource: DeleteControlUnitResource,
    private val getControlUnitResources: GetControlUnitResources,
    private val getControlUnitResourceById: GetControlUnitResourceById,
) {
    @PutMapping("/{controlUnitResourceId}/archive")
    @Operation(summary = "Archive a control unit resource")
    fun archive(
        @PathParam("Control unit resource ID")
        @PathVariable(name = "controlUnitResourceId")
        controlUnitResourceId: Int,
    ) {
        archiveControlUnitResource.execute(controlUnitResourceId)
    }

    @GetMapping("/{controlUnitResourceId}/can_delete")
    @Operation(summary = "Can this control unit resource be deleted?")
    fun canDelete(
        @PathParam("Control unit resource ID")
        @PathVariable(name = "controlUnitResourceId")
        controlUnitResourceId: Int,
    ): BooleanDataOutput = canDeleteControlUnitResource.execute(controlUnitResourceId).let { BooleanDataOutput.get(it) }

    @PostMapping("", consumes = ["application/json"])
    @Operation(summary = "Create a control unit resource")
    @ResponseStatus(HttpStatus.CREATED)
    fun create(
        @RequestBody
        createControlUnitResourceDataInput: CreateOrUpdateControlUnitResourceDataInput,
    ): ControlUnitResourceDataOutput {
        val newControlUnitResource = createControlUnitResourceDataInput.toControlUnitResource()
        val createdControlUnitResource = createOrUpdateControlUnitResource.execute(newControlUnitResource)

        return ControlUnitResourceDataOutput.fromControlUnitResource(createdControlUnitResource)
    }

    @DeleteMapping("/{controlUnitResourceId}")
    @Operation(summary = "Delete a control unit resource")
    fun delete(
        @PathParam("Control unit resource ID")
        @PathVariable(name = "controlUnitResourceId")
        controlUnitResourceId: Int,
    ) {
        deleteControlUnitResource.execute(controlUnitResourceId)
    }

    @GetMapping("/{controlUnitResourceId}")
    @Operation(summary = "Get a control unit resource by its ID")
    fun get(
        @PathParam("Control unit resource ID")
        @PathVariable(name = "controlUnitResourceId")
        controlUnitResourceId: Int,
    ): FullControlUnitResourceDataOutput {
        val foundFullControlUnitResource = getControlUnitResourceById.execute(controlUnitResourceId)

        return FullControlUnitResourceDataOutput.fromFullControlUnitResource(foundFullControlUnitResource)
    }

    @GetMapping("")
    @Operation(summary = "List control unit resources")
    fun getAll(): List<FullControlUnitResourceDataOutput> =
        getControlUnitResources
            .execute()
            .map { FullControlUnitResourceDataOutput.fromFullControlUnitResource(it) }

    @PutMapping(value = ["/{controlUnitResourceId}"], consumes = ["application/json"])
    @Operation(summary = "Update a control unit resource")
    fun update(
        @PathParam("Control unit resource ID")
        @PathVariable(name = "controlUnitResourceId")
        controlUnitResourceId: Int,
        @RequestBody
        updateControlUnitResourceDataInput: CreateOrUpdateControlUnitResourceDataInput,
    ): ControlUnitResourceDataOutput {
        requireNotNull(updateControlUnitResourceDataInput.id) { "`id` can't be null." }
        require(controlUnitResourceId == updateControlUnitResourceDataInput.id) {
            "Body ID ('${updateControlUnitResourceDataInput.id}') doesn't match path ID ('$controlUnitResourceId')."
        }

        val controlUnitResource = updateControlUnitResourceDataInput.toControlUnitResource()
        val updatedControlUnitResource = createOrUpdateControlUnitResource.execute(controlUnitResource)

        return ControlUnitResourceDataOutput.fromControlUnitResource(updatedControlUnitResource)
    }
}
