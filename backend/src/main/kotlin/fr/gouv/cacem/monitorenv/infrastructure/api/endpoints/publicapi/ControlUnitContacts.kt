package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi

import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.CreateOrUpdateControlUnitContact
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.DeleteControlUnitContact
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.GetControlUnitContactById
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.GetControlUnitContacts
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.CreateControlUnitContactDataInputV1
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.CreateOrUpdateControlUnitContactDataInputV2
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.ControlUnitContactDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.FullControlUnitContactDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.utils.validateId
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import tools.jackson.databind.json.JsonMapper

@RestController
@RequestMapping("/api")
@Tag(name = "Public.Control Unit Contacts")
class ControlUnitContacts(
    private val createOrUpdateControlUnitContact: CreateOrUpdateControlUnitContact,
    private val deleteControlUnitContact: DeleteControlUnitContact,
    private val getControlUnitContacts: GetControlUnitContacts,
    private val getControlUnitContactById: GetControlUnitContactById,
    private val jsonMapper: JsonMapper,
) {
    @PostMapping("/v1/control_unit_contacts", consumes = ["application/json"])
    @Operation(summary = "Create a control unit contact")
    @ResponseStatus(HttpStatus.CREATED)
    @Deprecated("Use POST /api/v2/control_unit_contacts")
    fun createV1(
        @RequestBody createControlUnitContactDataInput: CreateControlUnitContactDataInputV1,
    ): ControlUnitContactDataOutput {
        val newControlUnitContact = createControlUnitContactDataInput.toControlUnitContact()
        val createdControlUnitContact = createOrUpdateControlUnitContact.execute(newControlUnitContact)

        return ControlUnitContactDataOutput.fromControlUnitContact(createdControlUnitContact)
    }

    @PostMapping("/v2/control_unit_contacts", consumes = ["application/json"])
    @Operation(summary = "Create a control unit contact")
    @ResponseStatus(HttpStatus.CREATED)
    fun createV2(
        @RequestBody createControlUnitContactDataInput: CreateOrUpdateControlUnitContactDataInputV2,
    ): ControlUnitContactDataOutput {
        val newControlUnitContact = createControlUnitContactDataInput.toControlUnitContact()
        val createdControlUnitContact = createOrUpdateControlUnitContact.execute(newControlUnitContact)

        return ControlUnitContactDataOutput.fromControlUnitContact(createdControlUnitContact)
    }

    @DeleteMapping("/v1/control_unit_contacts/{controlUnitContactId}")
    @Operation(summary = "Delete a control unit contact")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteV1(
        @PathParam("Control unit contact ID")
        @PathVariable(name = "controlUnitContactId")
        controlUnitContactId: Int,
    ) {
        deleteControlUnitContact.execute(controlUnitContactId)
    }

    @GetMapping("/v1/control_unit_contacts/{controlUnitContactId}")
    @Operation(summary = "Get a control unit contact by its ID")
    fun getV1(
        @PathParam("Control unit contact ID")
        @PathVariable(name = "controlUnitContactId")
        controlUnitContactId: Int,
    ): FullControlUnitContactDataOutput {
        val foundFullControlUnitContact = getControlUnitContactById.execute(controlUnitContactId)

        return FullControlUnitContactDataOutput.fromFullControlUnitContact(foundFullControlUnitContact)
    }

    @GetMapping("/v1/control_unit_contacts")
    @Operation(summary = "List control unit contacts")
    fun getAllV1(): List<FullControlUnitContactDataOutput> {
        val foundFullControlUnitContacts = getControlUnitContacts.execute()

        return foundFullControlUnitContacts.map { FullControlUnitContactDataOutput.fromFullControlUnitContact(it) }
    }

    @PatchMapping(value = ["/v1/control_unit_contacts/{controlUnitContactId}"], consumes = ["application/json"])
    @Operation(summary = "Patch a control unit contact")
    fun patchV1(
        @PathParam("Control unit contact ID")
        @PathVariable(name = "controlUnitContactId")
        controlUnitContactId: Int,
        @RequestBody partialControlUnitContactAsJson: String,
    ): ControlUnitContactDataOutput {
        val existingFullControlUnitContact = getControlUnitContactById.execute(controlUnitContactId)
        val patchedControlUnitContact =
            CreateOrUpdateControlUnitContactDataInputV2
                .fromControlUnitContact(existingFullControlUnitContact.controlUnitContact)
                .patchFromRequestData(jsonMapper, partialControlUnitContactAsJson)
                .toControlUnitContact()
        val updatedControlUnitContact = createOrUpdateControlUnitContact.execute(patchedControlUnitContact)

        return ControlUnitContactDataOutput.fromControlUnitContact(updatedControlUnitContact)
    }

    @PutMapping(value = ["/v1/control_unit_contacts/{controlUnitContactId}"], consumes = ["application/json"])
    @Operation(summary = "Update a control unit contact")
    @Deprecated("Use PATCH /api/v2/control_unit_contacts/{controlUnitContactId}")
    fun updateV1(
        @PathParam("Control unit contact ID")
        @PathVariable(name = "controlUnitContactId")
        controlUnitContactId: Int,
        @RequestBody incompleteControlUnitContactAsJson: String,
    ): ControlUnitContactDataOutput {
        validateId(incompleteControlUnitContactAsJson, "id", controlUnitContactId, jsonMapper)

        val existingFullControlUnitContact = getControlUnitContactById.execute(controlUnitContactId)
        val patchedControlUnitContact =
            CreateOrUpdateControlUnitContactDataInputV2
                .fromControlUnitContact(existingFullControlUnitContact.controlUnitContact)
                .patchFromRequestData(jsonMapper, incompleteControlUnitContactAsJson)
                .toControlUnitContact()
        val updatedControlUnitContact = createOrUpdateControlUnitContact.execute(patchedControlUnitContact)

        return ControlUnitContactDataOutput.fromControlUnitContact(updatedControlUnitContact)
    }
}
