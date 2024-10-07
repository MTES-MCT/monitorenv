package fr.gouv.cacem.monitorenv.domain.use_cases.dashboard.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.DashboardEntity
import java.util.UUID

class DashboardFixture {
    companion object {
        fun aDashboard(
            id: UUID? = null,
            name: String = "",
            amps: List<Int> = listOf(),
            regulatoryAreas: List<Int> = listOf(),
            reportings: List<Int> = listOf(),
            vigilanceAreas: List<Int> = listOf(),
            inseeCode: String? = null,
        ): DashboardEntity {
            return DashboardEntity(
                id = id,
                name = name,
                amps = amps,
                regulatoryAreas = regulatoryAreas,
                inseeCode = inseeCode,
                reportings = reportings,
                vigilanceAreas = vigilanceAreas,
            )
        }
    }
}
