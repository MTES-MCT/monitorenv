package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.dashboards

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.DashboardEntity
import org.locationtech.jts.geom.Geometry
import java.util.UUID

class DashboardDataInput(
    val id: UUID?,
    val name: String,
    val geom: Geometry,
    val comments: String?,
    val inseeCode: String?,
    val amps: List<Int>,
    val controlUnits: List<Int>,
    val regulatoryAreas: List<Int>,
    val reportings: List<Int>,
    val vigilanceAreas: List<Int>,
) {
    fun toDashboardEntity(): DashboardEntity {
        return DashboardEntity(
            id = id,
            name = name,
            geom = geom,
            comments = comments,
            inseeCode = inseeCode,
            amps = amps,
            controlUnits = controlUnits,
            reportings = reportings,
            regulatoryAreas = regulatoryAreas,
            vigilanceAreas = vigilanceAreas,
        )
    }
}
