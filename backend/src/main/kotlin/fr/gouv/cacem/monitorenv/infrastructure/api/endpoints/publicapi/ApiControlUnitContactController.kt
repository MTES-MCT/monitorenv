package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi

import fr.gouv.cacem.monitorenv.domain.services.ControlUnitService
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.CreateOrUpdateControlUnitContact
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.GetControlUnitContactById
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.GetControlUnitContacts
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.CreateOrUpdateControlUnitContactDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.ControlUnitContactDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/control_unit_contacts")
@Tag(name = "Control Unit Contacts")
class ApiControlUnitContactController(
    private val createOrUpdateControlUnitContact: CreateOrUpdateControlUnitContact,
    private val getControlUnitContacts: GetControlUnitContacts,
    private val getControlUnitContactById: GetControlUnitContactById,
    private val controlUnitService: ControlUnitService,
) {
    @PostMapping("", consumes = ["application/json"])
    @Operation(summary = "Create a control unit contact")
    fun create(
        @RequestBody createNextControlUnitContactDataInput: CreateOrUpdateControlUnitContactDataInput,
    ): ControlUnitContactDataOutput {
        val newNextControlUnitContactEntity =
            createNextControlUnitContactDataInput.toNextControlUnitContactEntity()
        val createdNextControlUnitContactEntity =
            createOrUpdateControlUnitContact.execute(newNextControlUnitContactEntity)

        return ControlUnitContactDataOutput.fromNextControlUnitContactEntity(
            createdNextControlUnitContactEntity,
            controlUnitService
        )
    }

    @GetMapping("/{controlUnitContactId}")
    @Operation(summary = "Get a control unit contact by its ID")
    fun get(
        @PathParam("Control unit contact ID") @PathVariable(name = "controlUnitContactId") controlUnitContactId: Int,
    ): ControlUnitContactDataOutput {
        val foundNextControlUnitContactEntity = getControlUnitContactById.execute(controlUnitContactId)

        return ControlUnitContactDataOutput.fromNextControlUnitContactEntity(
            foundNextControlUnitContactEntity,
            controlUnitService
        )
    }

    @GetMapping("")
    @Operation(summary = "List control unit contacts")
    fun getAll(): List<ControlUnitContactDataOutput> {
        return getControlUnitContacts.execute()
            .map { ControlUnitContactDataOutput.fromNextControlUnitContactEntity(it, controlUnitService) }
    }

    @PostMapping(value = ["/{controlUnitContactId}"], consumes = ["application/json"])
    @Operation(summary = "Update a control unit contact")
    fun update(
        @PathParam("Control unit contact ID") @PathVariable(name = "controlUnitContactId") controlUnitContactId: Int,
        @RequestBody updateNextControlUnitContactDataInput: CreateOrUpdateControlUnitContactDataInput,
    ): ControlUnitContactDataOutput {
        if ((updateNextControlUnitContactDataInput.id == null) || (controlUnitContactId != updateNextControlUnitContactDataInput.id)) {
            throw java.lang.IllegalArgumentException("Unable to find (and update) control unit contact with ID = ${updateNextControlUnitContactDataInput.id}.")
        }

        val nextNextControlUnitContactEntity =
            updateNextControlUnitContactDataInput.toNextControlUnitContactEntity()
        val updatedNextControlUnitContactEntity =
            createOrUpdateControlUnitContact.execute(nextNextControlUnitContactEntity)

        return ControlUnitContactDataOutput.fromNextControlUnitContactEntity(
            updatedNextControlUnitContactEntity,
            controlUnitService
        )
    }
}
