package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi

import fr.gouv.cacem.monitorenv.domain.services.ControlUnitAdministrationService
import fr.gouv.cacem.monitorenv.domain.services.ControlUnitContactService
import fr.gouv.cacem.monitorenv.domain.services.ControlUnitResourceService
import fr.gouv.cacem.monitorenv.domain.services.PortService
import fr.gouv.cacem.monitorenv.domain.use_cases.nextControlUnit.CreateOrUpdateNextControlUnit
import fr.gouv.cacem.monitorenv.domain.use_cases.nextControlUnit.GetNextControlUnitById
import fr.gouv.cacem.monitorenv.domain.use_cases.nextControlUnit.GetNextControlUnits
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.CreateOrUpdateNextControlUnitDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.NextControlUnitDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/next_control_units")
@Tag(name = "Control Units")
class ApiControlUnitController(
    private val createOrUpdateNextControlUnit: CreateOrUpdateNextControlUnit,
    private val getNextControlUnits: GetNextControlUnits,
    private val getNextControlUnitById: GetNextControlUnitById,
    private val controlUnitAdministrationService: ControlUnitAdministrationService,
    private val controlUnitContactService: ControlUnitContactService,
    private val controlUnitResourceService: ControlUnitResourceService,
    private val portService: PortService,
) {
    companion object {
        val logger: Logger = LoggerFactory.getLogger(ApiControlUnitController::class.java)
    }

    @PostMapping("", consumes = ["application/json"])
    @Operation(summary = "Create a control unit")
    fun create(
        @RequestBody
        createNextControlUnitDataInput: CreateOrUpdateNextControlUnitDataInput,
    ): NextControlUnitDataOutput {
        val newNextControlUnitEntity =
            createNextControlUnitDataInput.toNextControlUnitEntity()
        logger.info("New NextControlUnitEntity: $newNextControlUnitEntity")
        val createdNextControlUnitEntity =
            createOrUpdateNextControlUnit.execute(newNextControlUnitEntity)

        return NextControlUnitDataOutput.fromNextControlUnitEntity(
            createdNextControlUnitEntity,
            controlUnitAdministrationService,
            controlUnitContactService,
            controlUnitResourceService,
            portService
        )
    }

    @GetMapping("/{controlUnitId}")
    @Operation(summary = "Get a control unit by its ID")
    fun get(
        @PathParam("Control unit ID")
        @PathVariable(name = "controlUnitId")
        controlUnitId: Int,
    ): NextControlUnitDataOutput {
        val foundNextControlUnitEntity = getNextControlUnitById.execute(controlUnitId)

        return NextControlUnitDataOutput.fromNextControlUnitEntity(
            foundNextControlUnitEntity,
            controlUnitAdministrationService,
            controlUnitContactService,
            controlUnitResourceService,
            portService
        )
    }

    @GetMapping("")
    @Operation(summary = "List control units")
    fun getAll(): List<NextControlUnitDataOutput> {
        return getNextControlUnits.execute()
            .map {
                NextControlUnitDataOutput.fromNextControlUnitEntity(
                    it,
                    controlUnitAdministrationService,
                    controlUnitContactService,
                    controlUnitResourceService,
                    portService
                )
            }
    }

    @PostMapping(value = ["/{controlUnitId}"], consumes = ["application/json"])
    @Operation(summary = "Update a control unit")
    fun update(
        @PathParam("Control unit ID")
        @PathVariable(name = "controlUnitId")
        controlUnitId: Int,
        @RequestBody
        updateNextControlUnitDataInput: CreateOrUpdateNextControlUnitDataInput,
    ): NextControlUnitDataOutput {
        if ((updateNextControlUnitDataInput.id == null) || (controlUnitId != updateNextControlUnitDataInput.id)) {
            throw java.lang.IllegalArgumentException("Unable to find (and update) control unit with ID = ${updateNextControlUnitDataInput.id}.")
        }

        val nextNextControlUnitEntity =
            updateNextControlUnitDataInput.toNextControlUnitEntity()
        val updatedNextControlUnitEntity =
            createOrUpdateNextControlUnit.execute(nextNextControlUnitEntity)

        return NextControlUnitDataOutput.fromNextControlUnitEntity(
            updatedNextControlUnitEntity,
            controlUnitAdministrationService,
            controlUnitContactService,
            controlUnitResourceService,
            portService
        )
    }
}
