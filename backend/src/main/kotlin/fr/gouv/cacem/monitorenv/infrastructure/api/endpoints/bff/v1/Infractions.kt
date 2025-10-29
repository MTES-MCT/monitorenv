package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.actions.GetEnvActionsByMmsi
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.GetSuspicionOfInfractionsByMmsi
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.actions.EnvActionControlWithInfractionsDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.reportings.ReportingHistoryOfInfractionDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/bff/v1/infractions")
@Tag(name = "BFF.Infractions")
class Infractions(
    private val getEnvActionsByMmsi: GetEnvActionsByMmsi,
    private val getSuspicionOfInfractionsByMmsi: GetSuspicionOfInfractionsByMmsi,
) {
    @GetMapping("actions/{mmsi}")
    @Operation(summary = "get infractions by mmsi")
    fun getInfractions(
        @PathVariable(name = "mmsi") mmsi: String,
    ): List<EnvActionControlWithInfractionsDataOutput> =
        getEnvActionsByMmsi.execute(mmsi).map {
            EnvActionControlWithInfractionsDataOutput.fromEnvActionControlWithInfractionsEntity(it)
        }

    @GetMapping("/reportings/{mmsi}")
    @Operation(summary = "Get suspicion of infractions by mmsi")
    fun getSuspicionOfInfraction(
        @PathVariable(name = "mmsi")
        mmsi: String,
        @RequestParam(name = "idToExclude", required = false) idToExclude: Int?,
    ): List<ReportingHistoryOfInfractionDataOutput> =
        getSuspicionOfInfractionsByMmsi.execute(mmsi, idToExclude).map {
            ReportingHistoryOfInfractionDataOutput.fromReportingHistoryOfInfraction(it)
        }
}
