package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.v3

import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.CreateOrUpdateControlUnitContact
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.DeleteControlUnitContact
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.GetControlUnitContactById
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.GetControlUnitContacts
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.controlUnits.CreateOrUpdateControlUnitContactDataInputV3
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.controlUnits.ControlUnitContactDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import tools.jackson.databind.json.JsonMapper

@RestController
@RequestMapping("/api/v3/control_unit_contacts")
@Tag(name = "Public.Control Unit Contacts V3")
class ControlUnitContactsV3(
    private val createOrUpdateControlUnitContact: CreateOrUpdateControlUnitContact,
) {
    @PostMapping("", consumes = ["application/json"])
    @Operation(summary = "Create a control unit contact")
    @ResponseStatus(HttpStatus.CREATED)
    fun createV3(
        @RequestBody createControlUnitContactDataInput: CreateOrUpdateControlUnitContactDataInputV3,
    ): ControlUnitContactDataOutput {
        val newControlUnitContact = createControlUnitContactDataInput.toControlUnitContact()
        val createdControlUnitContact = createOrUpdateControlUnitContact.execute(newControlUnitContact)

        return ControlUnitContactDataOutput.fromControlUnitContact(createdControlUnitContact)
    }
}
