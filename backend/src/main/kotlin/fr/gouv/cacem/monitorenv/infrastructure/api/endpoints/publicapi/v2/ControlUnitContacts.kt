package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.v2

import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.CreateOrUpdateControlUnitContact
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.GetControlUnitContactById
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.controlUnits.CreateOrUpdateControlUnitContactDataInputV2
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.controlUnits.CreateOrUpdateControlUnitContactDataInputV3
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.controlUnits.ControlUnitContactDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import tools.jackson.databind.json.JsonMapper

@RestController
@RequestMapping("/api/v2/control_unit_contacts")
@Tag(name = "Public.Control Unit Contacts V2")
class ControlUnitContactsV2(
    private val createOrUpdateControlUnitContact: CreateOrUpdateControlUnitContact,
    private val getControlUnitContactById: GetControlUnitContactById,
    private val jsonMapper: JsonMapper,
) {
    @PostMapping("", consumes = ["application/json"])
    @Operation(summary = "Create a control unit contact")
    @Deprecated("Use POST /api/v3/control_unit_contacts")
    @ResponseStatus(HttpStatus.CREATED)
    fun createV2(
        @RequestBody createControlUnitContactDataInput: CreateOrUpdateControlUnitContactDataInputV2,
    ): ControlUnitContactDataOutput {
        val newControlUnitContact = createControlUnitContactDataInput.toControlUnitContact()
        val createdControlUnitContact = createOrUpdateControlUnitContact.execute(newControlUnitContact)

        return ControlUnitContactDataOutput.fromControlUnitContact(createdControlUnitContact)
    }

    @PatchMapping(value = ["/{controlUnitContactId}"], consumes = ["application/json"])
    @Operation(summary = "Patch a control unit contact")
    fun patchV2(
        @PathParam("Control unit contact ID")
        @PathVariable(name = "controlUnitContactId")
        controlUnitContactId: Int,
        @RequestBody partialControlUnitContactAsJson: String,
    ): ControlUnitContactDataOutput {
        val existingFullControlUnitContact = getControlUnitContactById.execute(controlUnitContactId)
        val patchedControlUnitContact =
            CreateOrUpdateControlUnitContactDataInputV3.Companion
                .fromControlUnitContact(existingFullControlUnitContact.controlUnitContact)
                .patchFromRequestData(jsonMapper, partialControlUnitContactAsJson)
                .toControlUnitContact()
        val updatedControlUnitContact = createOrUpdateControlUnitContact.execute(patchedControlUnitContact)

        return ControlUnitContactDataOutput.Companion.fromControlUnitContact(updatedControlUnitContact)
    }
}
