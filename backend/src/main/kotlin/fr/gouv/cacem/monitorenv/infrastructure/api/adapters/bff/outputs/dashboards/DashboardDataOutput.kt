package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.dashboards

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.DashboardEntity
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.UUID

class DashboardDataOutput(
    val id: UUID?,
    val name: String,
    val geom: Geometry,
    val comments: String?,
    val createdAt: ZonedDateTime?,
    val updatedAt: ZonedDateTime?,
    val inseeCode: String?,
    val ampIds: List<Int>,
    val controlUnitIds: List<Int>,
    val regulatoryAreaIds: List<Int>,
    val reportingIds: List<Int>,
    val vigilanceAreaIds: List<Int>,
) {
    companion object {
        fun fromDashboardEntity(dashboardEntity: DashboardEntity): DashboardDataOutput {
            return DashboardDataOutput(
                id = dashboardEntity.id,
                name = "pouet",
                geom = dashboardEntity.geom,
                comments = dashboardEntity.comments,
                createdAt = dashboardEntity.createdAt,
                updatedAt = dashboardEntity.updatedAt,
                inseeCode = dashboardEntity.inseeCode,
                ampIds = dashboardEntity.ampIds,
                controlUnitIds = dashboardEntity.controlUnitIds,
                regulatoryAreaIds = dashboardEntity.regulatoryAreaIds,
                reportingIds = dashboardEntity.reportingIds,
                vigilanceAreaIds = dashboardEntity.vigilanceAreaIds,
            )
        }
    }
}
