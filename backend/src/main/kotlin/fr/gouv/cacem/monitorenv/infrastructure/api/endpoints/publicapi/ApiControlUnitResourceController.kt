package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi

import fr.gouv.cacem.monitorenv.domain.services.ControlUnitService
import fr.gouv.cacem.monitorenv.domain.services.PortService
import fr.gouv.cacem.monitorenv.domain.use_cases.nextControlUnit.CreateOrUpdateNextControlUnitResource
import fr.gouv.cacem.monitorenv.domain.use_cases.nextControlUnit.GetNextControlUnitResourceById
import fr.gouv.cacem.monitorenv.domain.use_cases.nextControlUnit.GetNextControlUnitResources
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.CreateOrUpdateNextControlUnitResourceDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.NextControlUnitResourceDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/control_unit_resources")
@Tag(name = "Control Unit Resources")
class ApiControlUnitResourceController(
    private val createOrUpdateNextControlUnitResource: CreateOrUpdateNextControlUnitResource,
    private val getNextControlUnitResources: GetNextControlUnitResources,
    private val getNextControlUnitResourceById: GetNextControlUnitResourceById,
    private val controlUnitService: ControlUnitService,
    private val portService: PortService,
) {
    @PostMapping("", consumes = ["application/json"])
    @Operation(summary = "Create a control unit resource")
    fun create(
        @RequestBody
        createNextControlUnitResourceDataInput: CreateOrUpdateNextControlUnitResourceDataInput,
    ): NextControlUnitResourceDataOutput {
        val newNextControlUnitResourceEntity =
            createNextControlUnitResourceDataInput.toNextControlUnitResourceEntity()
        val createdNextControlUnitResourceEntity =
            createOrUpdateNextControlUnitResource.execute(newNextControlUnitResourceEntity)

        return NextControlUnitResourceDataOutput.fromNextControlUnitResourceEntity(
            createdNextControlUnitResourceEntity,
            controlUnitService,
            portService
        )
    }

    @GetMapping("/{controlUnitResourceId}")
    @Operation(summary = "Get a control unit resource by its ID")
    fun get(
        @PathParam("Control unit resource ID")
        @PathVariable(name = "controlUnitResourceId")
        controlUnitResourceId: Int,
    ): NextControlUnitResourceDataOutput {
        val foundNextControlUnitResourceEntity = getNextControlUnitResourceById.execute(controlUnitResourceId)

        return NextControlUnitResourceDataOutput.fromNextControlUnitResourceEntity(
            foundNextControlUnitResourceEntity,
            controlUnitService,
            portService
        )
    }

    @GetMapping("")
    @Operation(summary = "List control unit resources")
    fun getAll(): List<NextControlUnitResourceDataOutput> {
        return getNextControlUnitResources.execute()
            .map {
                NextControlUnitResourceDataOutput.fromNextControlUnitResourceEntity(
                    it,
                    controlUnitService,
                    portService
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
        updateNextControlUnitResourceDataInput: CreateOrUpdateNextControlUnitResourceDataInput,
    ): NextControlUnitResourceDataOutput {
        if ((updateNextControlUnitResourceDataInput.id == null) || (controlUnitResourceId != updateNextControlUnitResourceDataInput.id)) {
            throw java.lang.IllegalArgumentException("Unable to find (and update) control unit resource with ID = ${updateNextControlUnitResourceDataInput.id}.")
        }

        val nextNextControlUnitResourceEntity =
            updateNextControlUnitResourceDataInput.toNextControlUnitResourceEntity()
        val updatedNextControlUnitResourceEntity =
            createOrUpdateNextControlUnitResource.execute(nextNextControlUnitResourceEntity)

        return NextControlUnitResourceDataOutput.fromNextControlUnitResourceEntity(
            updatedNextControlUnitResourceEntity,
            controlUnitService,
            portService
        )
    }
}
