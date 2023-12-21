package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.ArchiveReportings
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.CreateOrUpdateReporting
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.DeleteReporting
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.DeleteReportings
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.GetReportingById
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.GetReportings
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.CreateOrUpdateReportingDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.reportings.ReportingDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.reportings.ReportingsDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.HttpStatus
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
@Tag(description = "API des Signalements", name = "BFF.Reportings")
class Reportings(
    private val createOrUpdateReporting: CreateOrUpdateReporting,
    private val getReportingById: GetReportingById,
    private val getReportings: GetReportings,
    private val deleteReporting: DeleteReporting,
    private val deleteReportings: DeleteReportings,
    private val archiveReportings: ArchiveReportings,
) {

    @PutMapping(value = ["/archive"])
    @Operation(summary = "Archive multiple reportings")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun archiveReportings(@RequestBody ids: List<Int>) {
        archiveReportings.execute(ids)
    }

    @PutMapping("", consumes = ["application/json"])
    @Operation(summary = "Create a new reporting")
    @ResponseStatus(HttpStatus.CREATED)
    fun create(
        @RequestBody createReporting: CreateOrUpdateReportingDataInput,
    ): ReportingDataOutput {
        val newReporting = createReporting.toReportingEntity()
        val createdReporting = createOrUpdateReporting.execute(newReporting)
        return ReportingDataOutput.fromReportingDTO(createdReporting)
    }

    @DeleteMapping(value = ["/{id}"])
    @Operation(summary = "Delete a reporting")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(
        @PathParam("Id")
        @PathVariable(name = "id")
        id: Int,
    ) {
        deleteReporting.execute(id = id)
    }

    @PutMapping(value = ["/delete"])
    @Operation(summary = "Delete multiple reportings")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteReportings(@RequestBody ids: List<Int>) {
        deleteReportings.execute(ids)
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get reporting by id")
    fun get(
        @PathParam("reporting id")
        @PathVariable(name = "id")
        id: Int,
    ): ReportingDataOutput {
        return getReportingById.execute(id).let { ReportingDataOutput.fromReportingDTO(it) }
    }

    @GetMapping("")
    @Operation(summary = "Get reportings")
    fun getAll(
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
        @Parameter(description = "Reporting type")
        @RequestParam(name = "reportingType", required = false)
        reportingType: List<ReportingTypeEnum>?,
        @Parameter(description = "Facades")
        @RequestParam(name = "seaFronts", required = false)
        seaFronts: List<String>?,
        @Parameter(description = "Reporting source types")
        @RequestParam(name = "sourcesType", required = false)
        sourcesType: List<SourceTypeEnum>?,
        @Parameter(description = "Reporting status")
        @RequestParam(name = "status", required = false)
        status: List<String>?,
    ): List<ReportingsDataOutput> {
        return getReportings.execute(
            pageNumber = pageNumber,
            pageSize = pageSize,
            reportingType = reportingType,
            seaFronts = seaFronts,
            sourcesType = sourcesType,
            startedAfterDateTime = startedAfterDateTime,
            startedBeforeDateTime = startedBeforeDateTime,
            status = status,
        )
            .map { ReportingsDataOutput.fromReportingDTO(it) }
    }

    @PutMapping(value = ["/{id}"], consumes = ["application/json"])
    @Operation(summary = "update a reporting")
    fun update(
        @PathParam("reporting id")
        @PathVariable(name = "id")
        id: Int,
        @RequestBody reporting: CreateOrUpdateReportingDataInput,
    ): ReportingDataOutput {
        require(id == reporting.id) { "id in path and body must be the same" }
        return createOrUpdateReporting.execute(
            reporting.toReportingEntity(),
        )
            .let { ReportingDataOutput.fromReportingDTO(it) }
    }
}
