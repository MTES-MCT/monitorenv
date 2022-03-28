package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints

import fr.gouv.cacem.monitorenv.domain.use_cases.crud.operations.GetOperationById
import fr.gouv.cacem.monitorenv.domain.use_cases.crud.operations.GetOperations
import fr.gouv.cacem.monitorenv.domain.use_cases.crud.operations.UpdateOperation
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs.*
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.inputs.*

import io.micrometer.core.instrument.MeterRegistry
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*
import javax.websocket.server.PathParam

@RestController
@RequestMapping("/bff/v1/operations")
@Tag(description = "API Opérations", name = "Opérations" )
class OperationsController(
  private val getOperations: GetOperations,
  private val getOperationById: GetOperationById,
  private val updateOperation: UpdateOperation,
  meterRegistry: MeterRegistry) {

    @GetMapping("")
    @Operation(summary = "Get operations")
    fun getOperationsController(): List<OperationDataOutput> {
        val operations = getOperations.execute()

        return operations.map { OperationDataOutput.fromOperation(it) }
    }
    @GetMapping("/{operationId}")
    @Operation(summary = "Get operation by Id")
    fun getOperationByIdController(@PathParam("Operation id")
                        @PathVariable(name = "operationId")
                        operationId: Int): OperationDataOutput {
        val operation = getOperationById.execute(operationId = operationId)

        return OperationDataOutput.fromOperation(operation)
    }
    @PutMapping(value = ["/{operationId}"], consumes = ["application/json"])
    @Operation(summary = "Update an operation")
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
