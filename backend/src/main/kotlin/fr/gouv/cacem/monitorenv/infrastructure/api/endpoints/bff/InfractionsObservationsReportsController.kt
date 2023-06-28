package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff

import fr.gouv.cacem.monitorenv.domain.use_cases.infractionsObservationsReports.CreateOrUpdateInfractionsObservationsReport
import fr.gouv.cacem.monitorenv.domain.use_cases.infractionsObservationsReports.DeleteInfractionsObservationsReport
import fr.gouv.cacem.monitorenv.domain.use_cases.infractionsObservationsReports.GetAllInfractionsObservationsReports
import fr.gouv.cacem.monitorenv.domain.use_cases.infractionsObservationsReports.GetInfractionsObservationsReportById
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.inputs.CreateOrUpdateInfractionsObservationsReportDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs.InfractionsObservationsReportDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import jakarta.websocket.server.PathParam
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/bff/v1/infractions-observations-reports")
class InfractionsObservationsReportsController(
    private val createOrUpdateInfractionsObservationsReport: CreateOrUpdateInfractionsObservationsReport,
    private val getInfractionsObservationsReportById: GetInfractionsObservationsReportById,
    private val getAllInfractionsObservationsReports: GetAllInfractionsObservationsReports,
    private val deleteInfractionsObservationsReport: DeleteInfractionsObservationsReport,
) {

    @GetMapping("")
    @Operation(summary = "Get infractions and observations reports")
    fun getInfractionsObservationsReportsController(
        @Parameter(description = "page number")
        @RequestParam(name = "pageNumber")
        pageNumber: Int?,
        @Parameter(description = "page size")
        @RequestParam(name = "pageSize")
        pageSize: Int?,
    ): List<InfractionsObservationsReportDataOutput> {
        return getAllInfractionsObservationsReports.execute(
            pageNumber = pageNumber,
            pageSize = pageSize,
        ).map {
            InfractionsObservationsReportDataOutput.fromInfractionsObservationsReportEntity(it)
        }
    }

    @PutMapping("", consumes = ["application/json"])
    @Operation(summary = "Create a new infractions and observations report")
    fun createInfractionsObservationsReportController(
        @RequestBody
        createInfractionsObservationsReport: CreateOrUpdateInfractionsObservationsReportDataInput,
    ): InfractionsObservationsReportDataOutput {
        val newInfractionsObservationsReport = createInfractionsObservationsReport.toInfractionsObservationsReportEntity()
        val createdInfractionsObservationsReport = createOrUpdateInfractionsObservationsReport.execute(newInfractionsObservationsReport)
        return InfractionsObservationsReportDataOutput.fromInfractionsObservationsReportEntity(createdInfractionsObservationsReport)
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get infractions and observations report by id")
    fun getInfractionsObservationsReportByIdController(
        @PathParam("infractions and observations report id")
        @PathVariable(name = "id")
        id: Int,
    ): InfractionsObservationsReportDataOutput {
        return getInfractionsObservationsReportById.execute(id).let {
            InfractionsObservationsReportDataOutput.fromInfractionsObservationsReportEntity(it)
        }
    }

    @PutMapping(value = ["/{id}"], consumes = ["application/json"])
    @Operation(summary = "update an infractions and observations report")
    fun updateInfractionsObservationsReportController(
        @PathParam("infractions and observations report id")
        @PathVariable(name = "id")
        id: Int,
        @Parameter(description = "infractions and observations report")
        infractionsObservationsReport: CreateOrUpdateInfractionsObservationsReportDataInput,
    ): InfractionsObservationsReportDataOutput {
        return createOrUpdateInfractionsObservationsReport.execute(
            infractionsObservationsReport.toInfractionsObservationsReportEntity(),
        ).let {
            InfractionsObservationsReportDataOutput.fromInfractionsObservationsReportEntity(it)
        }
    }
}
