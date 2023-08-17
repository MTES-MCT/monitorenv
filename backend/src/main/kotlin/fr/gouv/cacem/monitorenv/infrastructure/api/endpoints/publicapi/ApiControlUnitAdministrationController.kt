package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi

import fr.gouv.cacem.monitorenv.domain.services.ControlUnitService
import fr.gouv.cacem.monitorenv.domain.use_cases.nextControlUnit.CreateOrUpdateNextControlUnitAdministration
import fr.gouv.cacem.monitorenv.domain.use_cases.nextControlUnit.GetNextControlUnitAdministrationById
import fr.gouv.cacem.monitorenv.domain.use_cases.nextControlUnit.GetNextControlUnitAdministrations
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.CreateOrUpdateNextControlUnitAdministrationDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.NextControlUnitAdministrationDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/control_unit_administrations")
@Tag(name = "Control Unit Administrations")
class ApiControlUnitAdministrationController(
    private val createOrUpdateNextControlUnitAdministration: CreateOrUpdateNextControlUnitAdministration,
    private val getNextControlUnitAdministrations: GetNextControlUnitAdministrations,
    private val getNextControlUnitAdministrationById: GetNextControlUnitAdministrationById,
    private val controlUnitService: ControlUnitService,
) {
    @PostMapping("", consumes = ["application/json"])
    @Operation(summary = "Create a control unit administration")
    fun create(
        @RequestBody
        createNextControlUnitAdministrationDataInput: CreateOrUpdateNextControlUnitAdministrationDataInput,
    ): NextControlUnitAdministrationDataOutput {
        val newNextControlUnitAdministrationEntity =
            createNextControlUnitAdministrationDataInput.toNextControlUnitAdministrationEntity()
        val createdNextControlUnitAdministrationEntity =
            createOrUpdateNextControlUnitAdministration.execute(newNextControlUnitAdministrationEntity)

        return NextControlUnitAdministrationDataOutput.fromNextControlUnitAdministrationEntity(
            createdNextControlUnitAdministrationEntity,
            controlUnitService
        )
    }

    @GetMapping("")
    @Operation(summary = "List control unit administrations")
    fun getAll(): List<NextControlUnitAdministrationDataOutput> {
        return getNextControlUnitAdministrations.execute()
            .map {
                NextControlUnitAdministrationDataOutput.fromNextControlUnitAdministrationEntity(
                    it,
                    controlUnitService
                )
            }
    }

    @GetMapping("/{controlUnitAdministrationId}")
    @Operation(summary = "Get a control unit administration by its ID")
    fun get(
        @PathParam("Control unit administration ID")
        @PathVariable(name = "controlUnitAdministrationId")
        controlUnitAdministrationId: Int,
    ): NextControlUnitAdministrationDataOutput {
        val foundNextControlUnitAdministrationEntity =
            getNextControlUnitAdministrationById.execute(controlUnitAdministrationId)

        return NextControlUnitAdministrationDataOutput.fromNextControlUnitAdministrationEntity(
            foundNextControlUnitAdministrationEntity,
            controlUnitService
        )
    }

    @PostMapping(value = ["/{controlUnitAdministrationId}"], consumes = ["application/json"])
    @Operation(summary = "Update a control unit administration")
    fun update(
        @PathParam("Control unit administration ID")
        @PathVariable(name = "controlUnitAdministrationId")
        controlUnitAdministrationId: Int,
        @RequestBody
        updateNextControlUnitAdministrationDataInput: CreateOrUpdateNextControlUnitAdministrationDataInput,
    ): NextControlUnitAdministrationDataOutput {
        if ((updateNextControlUnitAdministrationDataInput.id == null) || (controlUnitAdministrationId != updateNextControlUnitAdministrationDataInput.id)) {
            throw java.lang.IllegalArgumentException("Unable to find (and update) control unit administration with ID = ${updateNextControlUnitAdministrationDataInput.id}.")
        }

        val nextNextControlUnitAdministrationEntity =
            updateNextControlUnitAdministrationDataInput.toNextControlUnitAdministrationEntity()
        val updatedNextControlUnitAdministrationEntity =
            createOrUpdateNextControlUnitAdministration.execute(nextNextControlUnitAdministrationEntity)

        return NextControlUnitAdministrationDataOutput.fromNextControlUnitAdministrationEntity(
            updatedNextControlUnitAdministrationEntity,
            controlUnitService
        )
    }
}
