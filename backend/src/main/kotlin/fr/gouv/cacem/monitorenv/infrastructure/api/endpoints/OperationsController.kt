package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints

import fr.gouv.cacem.monitorenv.domain.use_cases.*
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs.*
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.inputs.*

import io.micrometer.core.instrument.MeterRegistry
import io.swagger.annotations.Api
import io.swagger.annotations.ApiOperation
import org.springframework.web.bind.annotation.*
import javax.websocket.server.PathParam

@RestController
@RequestMapping("/bff/v1/operations")
@Api(description = "API operations")
class OperationsController(
    private val getOperations: GetOperations,
    private val getOperationById: GetOperationById,
    private val updateOperation: UpdateOperation,
    meterRegistry: MeterRegistry) {

    @GetMapping("")
    @ApiOperation("Get operations")
    fun getOperationsController(): List<OperationDataOutput> {
        val operations = getOperations.execute()

        return operations.map { OperationDataOutput.fromOperation(it) }
    }
    @GetMapping("/{operationId}")
    @ApiOperation("Get operation by Id")
    fun getOperationByIdController(@PathParam("Operation id")
                        @PathVariable(name = "operationId")
                        operationId: Int): OperationDataOutput {
        val operation = getOperationById.execute(operationId = operationId)

        return OperationDataOutput.fromOperation(operation)
    }
    @PutMapping(value = ["/{operationId}"], consumes = ["application/json"])
    @ApiOperation("Update an operation")
    fun updateOperationController(@PathParam("Operation id")
                               @PathVariable(name = "operationId")
                               operationId: Int,
                               @RequestBody
                               updateOperationDataInput: UpdateOperationDataInput): OperationDataOutput {
        return updateOperation.execute(
                operation = updateOperationDataInput.toOperationEntity()).let {
                    OperationDataOutput.fromOperation(it)
        }
    }
}
