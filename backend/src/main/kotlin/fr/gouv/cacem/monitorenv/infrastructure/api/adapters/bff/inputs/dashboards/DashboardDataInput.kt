package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.dashboards

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.DashboardEntity
import java.util.UUID

class DashboardDataInput(
    val id: UUID?,
    val name: String,
    val reportings: List<Int>,
    val regulatoryAreas: List<Int>,
    val amps: List<Int>,
    val vigilanceAreas: List<Int>,
    val inseeCode: String?,
) {
    fun toDashboardEntity(): DashboardEntity {
        return DashboardEntity(
            id = id,
            name = name,
            reportings = reportings,
            regulatoryAreas = regulatoryAreas,
            amps = amps,
            vigilanceAreas = vigilanceAreas,
            inseeCode = inseeCode,
        )
    }
}
