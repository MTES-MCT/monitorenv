package fr.gouv.cacem.monitorenv.infrastructure.api

import fr.gouv.cacem.monitorenv.domain.entities.*
import fr.gouv.cacem.monitorenv.domain.use_cases.*
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs.*
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.inputs.*

import io.micrometer.core.instrument.MeterRegistry
import io.swagger.annotations.Api
import io.swagger.annotations.ApiOperation
import io.swagger.annotations.ApiParam
import kotlinx.coroutines.runBlocking
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.ZonedDateTime
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicInteger
import javax.websocket.server.PathParam

@RestController
@RequestMapping("/bff")
@Api(description = "API for UI frontend")
class BffController(
        private val getOperations: GetOperations,
        private val getOperation: GetOperation,
        private val updateOperation: UpdateOperation,
        meterRegistry: MeterRegistry) {

    @GetMapping("/v1/operations")
    @ApiOperation("Get operations")
    fun getOperations(): OperationsDataOutput {
        val operations = getOperations.execute()

        return OperationsDataOutput.fromOperations(operations)
    }
    @GetMapping("/v1/operation/{id}")
    @ApiOperation("Get operation")
    fun getOperation(@PathParam("Operation id")
                        @PathVariable(name = "operationId")
                        operationId: Int): OperationDataOutput {
        val operation = getOperation.execute(operationId = operationId)

        return OperationDataOutput.fromOperation(operation)
    }
    @PutMapping(value = ["/v1/operation/{operationId}"], consumes = ["application/json"])
    @ApiOperation("Update an operation")
    fun updateOperation(@PathParam("Operation id")
                               @PathVariable(name = "operationId")
                               operationId: Int,
                               @RequestBody
                               updateOperationDataInput: UpdateOperationDataInput): OperationDataOutput {
        return updateOperation.execute(
                operation = updateOperationDataInput.operation).let {
                    OperationDataOutput.fromOperation(it)
        }
    }
}
