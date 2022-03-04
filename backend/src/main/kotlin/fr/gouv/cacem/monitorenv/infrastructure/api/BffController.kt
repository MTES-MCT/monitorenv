package fr.gouv.cacem.monitorenv.infrastructure.api

import fr.gouv.cacem.monitorenv.domain.entities.*
import fr.gouv.cacem.monitorenv.domain.use_cases.*
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs.*

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
        meterRegistry: MeterRegistry) {
    companion object {
        const val zoneDateTimePattern = "yyyy-MM-dd'T'HH:mm:ss.000X"
    }

    @GetMapping("/v1/operations")
    @ApiOperation("Get operations")
    fun getOperations(
                          @ApiParam("Operations after date time")
                          @RequestParam(name = "afterDateTime")
                          @DateTimeFormat(pattern = zoneDateTimePattern)
                          afterDateTime: ZonedDateTime): OperationsDataOutput {
        val operations = getOperations.execute(afterDateTime)

        return OperationsDataOutput.fromOperations(operations)
    }
}
