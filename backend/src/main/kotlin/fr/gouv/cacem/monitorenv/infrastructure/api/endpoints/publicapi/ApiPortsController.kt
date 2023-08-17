package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi

import fr.gouv.cacem.monitorenv.domain.services.ControlUnitResourceService
import fr.gouv.cacem.monitorenv.domain.use_cases.port.CreateOrUpdatePort
import fr.gouv.cacem.monitorenv.domain.use_cases.port.GetPortById
import fr.gouv.cacem.monitorenv.domain.use_cases.port.GetPorts
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.CreateOrUpdatePortDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.PortDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/ports")
@Tag(name = "Ports", description = "API ports")
class ApiPortsController(
    private val createOrUpdatePort: CreateOrUpdatePort,
    private val getPorts: GetPorts,
    private val getPortById: GetPortById,
    private val controlUnitResourceService: ControlUnitResourceService,
) {
    @PostMapping("", consumes = ["application/json"])
    @Operation(summary = "Create a port")
    fun create(
        @RequestBody
        createPortDataInput: CreateOrUpdatePortDataInput,
    ): PortDataOutput {
        val newPortEntity = createPortDataInput.toPortEntity()
        val createdPortEntity = createOrUpdatePort.execute(newPortEntity)

        return PortDataOutput.fromPortEntity(createdPortEntity, controlUnitResourceService)
    }

    @GetMapping("/{portId}")
    @Operation(summary = "Get a port by its ID")
    fun get(
        @PathParam("Port ID")
        @PathVariable(name = "portId")
        portId: Int,
    ): PortDataOutput {
        val foundPortEntity = getPortById.execute(portId)

        return PortDataOutput.fromPortEntity(foundPortEntity, controlUnitResourceService)
    }

    @GetMapping("")
    @Operation(summary = "List ports")
    fun getAll(): List<PortDataOutput> {
        return getPorts.execute().map { PortDataOutput.fromPortEntity(it, controlUnitResourceService) }
    }

    @PostMapping(value = ["/{portId}"], consumes = ["application/json"])
    @Operation(summary = "Update a port")
    fun update(
        @PathParam("Port ID")
        @PathVariable(name = "portId")
        portId: Int,
        @RequestBody
        updatePortDataInput: CreateOrUpdatePortDataInput,
    ): PortDataOutput {
        if ((updatePortDataInput.id == null) || (portId != updatePortDataInput.id)) {
            throw java.lang.IllegalArgumentException("Unable to find (and update) port with ID = ${updatePortDataInput.id}.")
        }

        val nextPortEntity = updatePortDataInput.toPortEntity()
        val updatedPortEntity = createOrUpdatePort.execute(nextPortEntity)

        return PortDataOutput.fromPortEntity(updatedPortEntity, controlUnitResourceService)
    }
}
