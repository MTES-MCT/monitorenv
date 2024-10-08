package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.dashboards

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.DashboardEntity
import org.locationtech.jts.geom.Geometry
import java.util.UUID

class DashboardDataOutput(
    val id: UUID?,
    val name: String,
    val geom: Geometry,
    val reportings: List<Int>,
    val regulatoryAreas: List<Int>,
    val amps: List<Int>,
    val vigilanceAreas: List<Int>,
    val inseeCode: String?,
) {
    companion object {
        fun fromDashboardEntity(dashboardEntity: DashboardEntity): DashboardDataOutput {
            return DashboardDataOutput(
                id = dashboardEntity.id,
                name = dashboardEntity.name,
                geom = dashboardEntity.geom,
                reportings = dashboardEntity.reportings,
                amps = dashboardEntity.amps,
                regulatoryAreas = dashboardEntity.regulatoryAreas,
                vigilanceAreas = dashboardEntity.vigilanceAreas,
                inseeCode = dashboardEntity.inseeCode,
            )
        }
    }
}
