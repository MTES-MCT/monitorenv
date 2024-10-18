package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.dashboards

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.DashboardEntity
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.*

class DashboardsDataOutput(
    val id: UUID?,
    val name: String,
    val geom: Geometry,
    val comments: String?,
    val createdAt: ZonedDateTime?,
    val updatedAt: ZonedDateTime?,
    val inseeCode: String?,
    val amps: List<Int>,
    val controlUnits: List<Int>,
    val regulatoryAreas: List<Int>,
    val reportings: List<Int>,
    val seaFront: String?,
    val vigilanceAreas: List<Int>,
) {
    companion object {
        fun fromDashboardEntity(dashboardEntity: DashboardEntity): DashboardsDataOutput {
            return DashboardsDataOutput(
                id = dashboardEntity.id,
                name = dashboardEntity.name,
                geom = dashboardEntity.geom,
                comments = dashboardEntity.comments,
                createdAt = dashboardEntity.createdAt,
                updatedAt = dashboardEntity.updatedAt,
                inseeCode = dashboardEntity.inseeCode,
                amps = dashboardEntity.amps,
                controlUnits = dashboardEntity.controlUnits,
                regulatoryAreas = dashboardEntity.regulatoryAreas,
                reportings = dashboardEntity.reportings,
                seaFront = dashboardEntity.seaFront,
                vigilanceAreas = dashboardEntity.vigilanceAreas,
            )
        }
    }
}