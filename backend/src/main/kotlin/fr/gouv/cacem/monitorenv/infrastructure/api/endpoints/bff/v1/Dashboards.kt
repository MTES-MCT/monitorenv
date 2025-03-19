package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.dashboard.DeleteDashboard
import fr.gouv.cacem.monitorenv.domain.use_cases.dashboard.ExtractArea
import fr.gouv.cacem.monitorenv.domain.use_cases.dashboard.GetDashboard
import fr.gouv.cacem.monitorenv.domain.use_cases.dashboard.GetDashboards
import fr.gouv.cacem.monitorenv.domain.use_cases.dashboard.SaveDashboard
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.dashboards.DashboardDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.dashboards.DashboardDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.dashboards.DashboardDataOutput.Companion.fromDashboardEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.dashboards.DashboardsDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.dashboards.ExtractedAreaDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.dashboards.ExtractedAreaDataOutput.Companion.fromExtractAreaEntity
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.locationtech.jts.io.WKTReader
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/bff/v1/dashboards")
@Tag(name = "BFF.Dashboard")
class Dashboards(
    private val extractArea: ExtractArea,
    private val saveDashboard: SaveDashboard,
    private val getDashboards: GetDashboards,
    private val getDashboard: GetDashboard,
    private val deleteDashboard: DeleteDashboard,
) {
    @GetMapping("/extract")
    @Operation(summary = "Extract all data that intercept the given geometry")
    fun extract(
        @RequestParam(name = "geometry") pGeometry: String,
    ): ExtractedAreaDataOutput {
        val wktReader = WKTReader()
        val geometry = wktReader.read(pGeometry)
        return fromExtractAreaEntity(extractArea.execute(geometry = geometry))
    }

    @GetMapping("")
    @Operation(summary = "Get Dashboards")
    fun getAll(): List<DashboardsDataOutput> {
        val dashboards = getDashboards.execute()

        return dashboards.map { DashboardsDataOutput.fromDashboardEntity(it) }
    }

    @PutMapping("", consumes = ["application/json"])
    @Operation(summary = "create or update the given dashboard")
    fun put(
        @RequestBody dashboardDataInput: DashboardDataInput,
    ): DashboardDataOutput = fromDashboardEntity(saveDashboard.execute(dashboardDataInput.toDashboardEntity()))

    @DeleteMapping("/{id}")
    @Operation(summary = "create or update the given dashboard")
    fun delete(
        @PathParam("Mission Id")
        @PathVariable(name = "id")
        id: UUID,
    ) {
        deleteDashboard.execute(id)
    }

    @GetMapping("/{dashboardId}")
    @Operation(summary = "Get dashboard by Id")
    fun get(
        @PathParam("Dashboard id")
        @PathVariable(name = "dashboardId")
        dashboardId: UUID,
    ): DashboardDataOutput = fromDashboardEntity(getDashboard.execute(dashboardId))
}
