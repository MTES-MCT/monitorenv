package fr.gouv.cacem.monitorenv.domain.use_cases.dashboard.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.BriefingEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.DashboardEntity
import java.util.UUID

class DashboardFixture {
    companion object {
        fun aDashboard(
            id: UUID? = null,
            briefings: List<BriefingEntity> = listOf(),
        ): DashboardEntity {
            return DashboardEntity(
                id = id,
                name = "",
                briefings = briefings,
            )
        }

        fun aBriefing(id: UUID? = null): BriefingEntity {
            return BriefingEntity(
                id = id,
                ampId = 1,
                inseeCode = "94",
                reportingId = null,
                regulatoryAreaId = null,
                vigilanceAreaId = null,
            )
        }
    }
}
