package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi

import fr.gouv.cacem.monitorenv.domain.services.ControlUnitService
import fr.gouv.cacem.monitorenv.domain.services.BaseService
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.CreateOrUpdateControlUnitResource
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.GetControlUnitResourceById
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.GetControlUnitResources
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.CreateOrUpdateControlUnitResourceDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.ControlUnitResourceDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/control_unit_resources")
@Tag(name = "Control Unit Resources")
class ApiControlUnitResourceController(
    private val createOrUpdateControlUnitResource: CreateOrUpdateControlUnitResource,
    private val getControlUnitResources: GetControlUnitResources,
    private val getControlUnitResourceById: GetControlUnitResourceById,
    private val baseService: BaseService,
    private val controlUnitService: ControlUnitService,
) {
    @PostMapping("", consumes = ["application/json"])
    @Operation(summary = "Create a control unit resource")
    fun create(
        @RequestBody
        createNextControlUnitResourceDataInput: CreateOrUpdateControlUnitResourceDataInput,
    ): ControlUnitResourceDataOutput {
        val newNextControlUnitResourceEntity =
            createNextControlUnitResourceDataInput.toNextControlUnitResourceEntity()
        val createdNextControlUnitResourceEntity =
            createOrUpdateControlUnitResource.execute(newNextControlUnitResourceEntity)

        return ControlUnitResourceDataOutput.fromNextControlUnitResourceEntity(
            createdNextControlUnitResourceEntity,
            baseService,
            controlUnitService,
        )
    }

    @GetMapping("/{controlUnitResourceId}")
    @Operation(summary = "Get a control unit resource by its ID")
    fun get(
        @PathParam("Control unit resource ID")
        @PathVariable(name = "controlUnitResourceId")
        controlUnitResourceId: Int,
    ): ControlUnitResourceDataOutput {
        val foundNextControlUnitResourceEntity = getControlUnitResourceById.execute(controlUnitResourceId)

        return ControlUnitResourceDataOutput.fromNextControlUnitResourceEntity(
            foundNextControlUnitResourceEntity,
            baseService,
            controlUnitService,
        )
    }

    @GetMapping("")
    @Operation(summary = "List control unit resources")
    fun getAll(): List<ControlUnitResourceDataOutput> {
        return getControlUnitResources.execute()
            .map {
                ControlUnitResourceDataOutput.fromNextControlUnitResourceEntity(
                    it,
                    baseService,
                    controlUnitService,
                )
            }
    }

    @PostMapping(value = ["/{controlUnitResourceId}"], consumes = ["application/json"])
    @Operation(summary = "Update a control unit resource")
    fun update(
        @PathParam("Control unit resource ID")
        @PathVariable(name = "controlUnitResourceId")
        controlUnitResourceId: Int,
        @RequestBody
        updateNextControlUnitResourceDataInput: CreateOrUpdateControlUnitResourceDataInput,
    ): ControlUnitResourceDataOutput {
        if ((updateNextControlUnitResourceDataInput.id == null) || (controlUnitResourceId != updateNextControlUnitResourceDataInput.id)) {
            throw java.lang.IllegalArgumentException("Unable to find (and update) control unit resource with ID = ${updateNextControlUnitResourceDataInput.id}.")
        }

        val nextNextControlUnitResourceEntity =
            updateNextControlUnitResourceDataInput.toNextControlUnitResourceEntity()
        val updatedNextControlUnitResourceEntity =
            createOrUpdateControlUnitResource.execute(nextNextControlUnitResourceEntity)

        return ControlUnitResourceDataOutput.fromNextControlUnitResourceEntity(
            updatedNextControlUnitResourceEntity,
            baseService,
            controlUnitService,
        )
    }
}
