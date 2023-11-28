package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi

import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.CreateOrUpdateControlUnitContact
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.DeleteControlUnitContact
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.GetControlUnitContactById
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.GetControlUnitContacts
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.CreateOrUpdateControlUnitContactDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.ControlUnitContactDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.FullControlUnitContactDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/control_unit_contacts")
@Tag(name = "Public.Control Unit Contacts")
class ApiControlUnitContactsController(
    private val createOrUpdateControlUnitContact: CreateOrUpdateControlUnitContact,
    private val deleteControlUnitContact: DeleteControlUnitContact,
    private val getControlUnitContacts: GetControlUnitContacts,
    private val getControlUnitContactById: GetControlUnitContactById,
) {
    @PostMapping("", consumes = ["application/json"])
    @Operation(summary = "Create a control unit contact")
    @ResponseStatus(HttpStatus.CREATED)
    fun create(
        @RequestBody createControlUnitContactDataInput: CreateOrUpdateControlUnitContactDataInput,
    ): ControlUnitContactDataOutput {
        val newControlUnitContact = createControlUnitContactDataInput.toControlUnitContact()
        val createdControlUnitContact = createOrUpdateControlUnitContact.execute(newControlUnitContact)

        return ControlUnitContactDataOutput.fromControlUnitContact(createdControlUnitContact)
    }

    @DeleteMapping("/{controlUnitContactId}")
    @Operation(summary = "Delete a control unit contact")
    fun delete(
        @PathParam("Control unit contact ID")
        @PathVariable(name = "controlUnitContactId")
        controlUnitContactId: Int,
    ) {
        deleteControlUnitContact.execute(controlUnitContactId)
    }

    @GetMapping("/{controlUnitContactId}")
    @Operation(summary = "Get a control unit contact by its ID")
    fun get(
        @PathParam("Control unit contact ID")
        @PathVariable(name = "controlUnitContactId")
        controlUnitContactId: Int,
    ): FullControlUnitContactDataOutput {
        val foundFullControlUnitContact = getControlUnitContactById.execute(controlUnitContactId)

        return FullControlUnitContactDataOutput.fromFullControlUnitContact(foundFullControlUnitContact)
    }

    @GetMapping("")
    @Operation(summary = "List control unit contacts")
    fun getAll(): List<FullControlUnitContactDataOutput> {
        val foundFullControlUnitContacts = getControlUnitContacts.execute()

        return foundFullControlUnitContacts.map { FullControlUnitContactDataOutput.fromFullControlUnitContact(it) }
    }

    @PutMapping(value = ["/{controlUnitContactId}"], consumes = ["application/json"])
    @Operation(summary = "Update a control unit contact")
    fun update(
        @PathParam("Control unit contact ID")
        @PathVariable(name = "controlUnitContactId")
        controlUnitContactId: Int,
        @RequestBody updateControlUnitContactDataInput: CreateOrUpdateControlUnitContactDataInput,
    ): ControlUnitContactDataOutput {
        requireNotNull(updateControlUnitContactDataInput.id) { "`id` can't be null." }
        require(controlUnitContactId == updateControlUnitContactDataInput.id) {
            "Body ID ('${updateControlUnitContactDataInput.id}') doesn't match path ID ('$controlUnitContactId')."
        }

        val nextControlUnitContact = updateControlUnitContactDataInput.toControlUnitContact()
        val updatedControlUnitContact = createOrUpdateControlUnitContact.execute(nextControlUnitContact)

        return ControlUnitContactDataOutput.fromControlUnitContact(updatedControlUnitContact)
    }
}
