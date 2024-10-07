package fr.gouv.cacem.monitorenv.domain.use_cases.dashboard

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.DashboardEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IDashboardRepository

@UseCase
class SaveDashboard(
    private val dashboardRepository: IDashboardRepository,
) {
    fun execute(dashboard: DashboardEntity): DashboardEntity {
        return dashboardRepository.save(dashboard)
    }
}
