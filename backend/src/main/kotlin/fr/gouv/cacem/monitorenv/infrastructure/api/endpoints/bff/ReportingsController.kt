package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff

import fr.gouv.cacem.monitorenv.domain.use_cases.reporting.CreateOrUpdateReporting
import fr.gouv.cacem.monitorenv.domain.use_cases.reporting.DeleteReporting
import fr.gouv.cacem.monitorenv.domain.use_cases.reporting.GetAllReportings
import fr.gouv.cacem.monitorenv.domain.use_cases.reporting.GetReportingById
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.CreateOrUpdateReportingDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.ReportingDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.ReportingDetailedDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.http.HttpStatus
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.time.ZonedDateTime

@RestController
@RequestMapping("/bff/v1/reportings")
@Tag(description = "API des Signalements", name = "Reportings")
class ReportingsController(
    private val createOrUpdateReporting: CreateOrUpdateReporting,
    private val getReportingById: GetReportingById,
    private val getAllReportings: GetAllReportings,
    private val deleteReporting: DeleteReporting,
) {

    @GetMapping("")
    @Operation(summary = "Get reportings")
    fun getReportingsController(
        @Parameter(description = "page number")
        @RequestParam(name = "pageNumber")
        pageNumber: Int?,
        @Parameter(description = "page size")
        @RequestParam(name = "pageSize")
        pageSize: Int?,
        @Parameter(description = "Reporting created after date")
        @RequestParam(name = "startedAfterDateTime", required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        startedAfterDateTime: ZonedDateTime?,
        @Parameter(description = "Reporting created before date")
        @RequestParam(name = "startedBeforeDateTime", required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        startedBeforeDateTime: ZonedDateTime?,
    ): List<ReportingDetailedDataOutput> {
        return getAllReportings.execute(
            pageNumber = pageNumber,
            pageSize = pageSize,
            startedAfterDateTime = startedAfterDateTime,
            startedBeforeDateTime = startedBeforeDateTime,
        ).map {
            ReportingDetailedDataOutput.fromReporting(it.first, it.second, it.third)
        }
    }

    @PutMapping("", consumes = ["application/json"])
    @Operation(summary = "Create a new reporting")
    @ResponseStatus(HttpStatus.CREATED)
    fun createReportingController(
        @RequestBody
        createReporting: CreateOrUpdateReportingDataInput,
    ): ReportingDataOutput {
        val newReporting = createReporting.toReportingEntity()
        val createdReporting = createOrUpdateReporting.execute(newReporting)
        return ReportingDataOutput.fromReporting(createdReporting.first, createdReporting.second, createdReporting.third)
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get reporting by id")
    fun getReportingByIdController(
        @PathParam("reporting id")
        @PathVariable(name = "id")
        id: Int,
    ): ReportingDataOutput {
        return getReportingById.execute(id).let {
            ReportingDataOutput.fromReporting(it.first, it.second, it.third)
        }
    }

    @PutMapping(value = ["/{id}"], consumes = ["application/json"])
    @Operation(summary = "update a reporting")
    fun updateReportingController(
        @PathParam("reporting id")
        @PathVariable(name = "id")
        id: Int,
        @RequestBody
        reporting: CreateOrUpdateReportingDataInput,
    ): ReportingDataOutput {
        require(id == reporting.id) { "id in path and body must be the same" }
        return createOrUpdateReporting.execute(
            reporting.toReportingEntity(),
        ).let {
            ReportingDataOutput.fromReporting(it.first, it.second, it.third)
        }
    }

    @DeleteMapping(value = ["/{id}"])
    @Operation(summary = "Delete a reporting")
    fun deleteController(
        @PathParam("Id")
        @PathVariable(name = "id")
        id: Int,
    ) {
        deleteReporting.execute(id = id)
    }
}
