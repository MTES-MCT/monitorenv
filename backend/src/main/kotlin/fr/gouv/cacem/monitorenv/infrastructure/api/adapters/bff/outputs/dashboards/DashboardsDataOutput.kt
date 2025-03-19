package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.dashboards

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.DashboardEntity
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.UUID

class DashboardsDataOutput(
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
    val seaFront: String?,
) {
    companion object {
        fun fromDashboardEntity(dashboardEntity: DashboardEntity): DashboardsDataOutput =
            DashboardsDataOutput(
                id = dashboardEntity.id,
                name = dashboardEntity.name,
                geom = dashboardEntity.geom,
                comments = dashboardEntity.comments,
                createdAt = dashboardEntity.createdAt,
                updatedAt = dashboardEntity.updatedAt,
                inseeCode = dashboardEntity.inseeCode,
                ampIds = dashboardEntity.ampIds,
                controlUnitIds = dashboardEntity.controlUnitIds,
                regulatoryAreaIds = dashboardEntity.regulatoryAreaIds,
                reportingIds = dashboardEntity.reportingIds,
                seaFront = dashboardEntity.seaFront,
                vigilanceAreaIds = dashboardEntity.vigilanceAreaIds,
            )
    }
}
