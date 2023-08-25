package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi

import fr.gouv.cacem.monitorenv.domain.services.AdministrationService
import fr.gouv.cacem.monitorenv.domain.services.ControlUnitContactService
import fr.gouv.cacem.monitorenv.domain.services.ControlUnitResourceService
import fr.gouv.cacem.monitorenv.domain.services.BaseService
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.CreateOrUpdateControlUnit
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.GetControlUnitById
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.GetControlUnits
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.CreateOrUpdateControlUnitDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.ControlUnitDataOutput
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
    private val createOrUpdateControlUnit: CreateOrUpdateControlUnit,
    private val getControlUnits: GetControlUnits,
    private val getControlUnitById: GetControlUnitById,
    private val administrationService: AdministrationService,
    private val controlUnitContactService: ControlUnitContactService,
    private val controlUnitResourceService: ControlUnitResourceService,
    private val baseService: BaseService,
) {
    companion object {
        val logger: Logger = LoggerFactory.getLogger(ApiControlUnitController::class.java)
    }

    @PostMapping("", consumes = ["application/json"])
    @Operation(summary = "Create a control unit")
    fun create(
        @RequestBody
        createNextControlUnitDataInput: CreateOrUpdateControlUnitDataInput,
    ): ControlUnitDataOutput {
        val newNextControlUnitEntity =
            createNextControlUnitDataInput.toNextControlUnitEntity()
        logger.info("New NextControlUnitEntity: $newNextControlUnitEntity")
        val createdNextControlUnitEntity =
            createOrUpdateControlUnit.execute(newNextControlUnitEntity)

        return ControlUnitDataOutput.fromNextControlUnitEntity(
            createdNextControlUnitEntity,
            administrationService,
            controlUnitContactService,
            controlUnitResourceService,
            baseService
        )
    }

    @GetMapping("/{controlUnitId}")
    @Operation(summary = "Get a control unit by its ID")
    fun get(
        @PathParam("Control unit ID")
        @PathVariable(name = "controlUnitId")
        controlUnitId: Int,
    ): ControlUnitDataOutput {
        val foundNextControlUnitEntity = getControlUnitById.execute(controlUnitId)

        return ControlUnitDataOutput.fromNextControlUnitEntity(
            foundNextControlUnitEntity,
            administrationService,
            controlUnitContactService,
            controlUnitResourceService,
            baseService
        )
    }

    @GetMapping("")
    @Operation(summary = "List control units")
    fun getAll(): List<ControlUnitDataOutput> {
        return getControlUnits.execute()
            .map {
                ControlUnitDataOutput.fromNextControlUnitEntity(
                    it,
                    administrationService,
                    controlUnitContactService,
                    controlUnitResourceService,
                    baseService
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
        updateNextControlUnitDataInput: CreateOrUpdateControlUnitDataInput,
    ): ControlUnitDataOutput {
        if ((updateNextControlUnitDataInput.id == null) || (controlUnitId != updateNextControlUnitDataInput.id)) {
            throw java.lang.IllegalArgumentException("Unable to find (and update) control unit with ID = ${updateNextControlUnitDataInput.id}.")
        }

        val nextNextControlUnitEntity =
            updateNextControlUnitDataInput.toNextControlUnitEntity()
        val updatedNextControlUnitEntity =
            createOrUpdateControlUnit.execute(nextNextControlUnitEntity)

        return ControlUnitDataOutput.fromNextControlUnitEntity(
            updatedNextControlUnitEntity,
            administrationService,
            controlUnitContactService,
            controlUnitResourceService,
            baseService
        )
    }
}
