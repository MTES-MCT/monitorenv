package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi

import fr.gouv.cacem.monitorenv.domain.services.ControlUnitService
import fr.gouv.cacem.monitorenv.domain.use_cases.nextControlUnit.CreateOrUpdateNextControlUnitContact
import fr.gouv.cacem.monitorenv.domain.use_cases.nextControlUnit.GetNextControlUnitContactById
import fr.gouv.cacem.monitorenv.domain.use_cases.nextControlUnit.GetNextControlUnitContacts
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.CreateOrUpdateNextControlUnitContactDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.NextControlUnitContactDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/control_unit_contacts")
@Tag(name = "Control Unit Contacts")
class ApiControlUnitContactController(
    private val createOrUpdateNextControlUnitContact: CreateOrUpdateNextControlUnitContact,
    private val getNextControlUnitContacts: GetNextControlUnitContacts,
    private val getNextControlUnitContactById: GetNextControlUnitContactById,
    private val controlUnitService: ControlUnitService,
) {
    @PostMapping("", consumes = ["application/json"])
    @Operation(summary = "Create a control unit contact")
    fun create(
        @RequestBody createNextControlUnitContactDataInput: CreateOrUpdateNextControlUnitContactDataInput,
    ): NextControlUnitContactDataOutput {
        val newNextControlUnitContactEntity =
            createNextControlUnitContactDataInput.toNextControlUnitContactEntity()
        val createdNextControlUnitContactEntity =
            createOrUpdateNextControlUnitContact.execute(newNextControlUnitContactEntity)

        return NextControlUnitContactDataOutput.fromNextControlUnitContactEntity(
            createdNextControlUnitContactEntity,
            controlUnitService
        )
    }

    @GetMapping("/{controlUnitContactId}")
    @Operation(summary = "Get a control unit contact by its ID")
    fun get(
        @PathParam("Control unit contact ID") @PathVariable(name = "controlUnitContactId") controlUnitContactId: Int,
    ): NextControlUnitContactDataOutput {
        val foundNextControlUnitContactEntity = getNextControlUnitContactById.execute(controlUnitContactId)

        return NextControlUnitContactDataOutput.fromNextControlUnitContactEntity(
            foundNextControlUnitContactEntity,
            controlUnitService
        )
    }

    @GetMapping("")
    @Operation(summary = "List control unit contacts")
    fun getAll(): List<NextControlUnitContactDataOutput> {
        return getNextControlUnitContacts.execute()
            .map { NextControlUnitContactDataOutput.fromNextControlUnitContactEntity(it, controlUnitService) }
    }

    @PostMapping(value = ["/{controlUnitContactId}"], consumes = ["application/json"])
    @Operation(summary = "Update a control unit contact")
    fun update(
        @PathParam("Control unit contact ID") @PathVariable(name = "controlUnitContactId") controlUnitContactId: Int,
        @RequestBody updateNextControlUnitContactDataInput: CreateOrUpdateNextControlUnitContactDataInput,
    ): NextControlUnitContactDataOutput {
        if ((updateNextControlUnitContactDataInput.id == null) || (controlUnitContactId != updateNextControlUnitContactDataInput.id)) {
            throw java.lang.IllegalArgumentException("Unable to find (and update) control unit contact with ID = ${updateNextControlUnitContactDataInput.id}.")
        }

        val nextNextControlUnitContactEntity =
            updateNextControlUnitContactDataInput.toNextControlUnitContactEntity()
        val updatedNextControlUnitContactEntity =
            createOrUpdateNextControlUnitContact.execute(nextNextControlUnitContactEntity)

        return NextControlUnitContactDataOutput.fromNextControlUnitContactEntity(
            updatedNextControlUnitContactEntity,
            controlUnitService
        )
    }
}
