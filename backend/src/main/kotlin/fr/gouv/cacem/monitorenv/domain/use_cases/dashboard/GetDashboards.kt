package fr.gouv.cacem.monitorenv.domain.use_cases.dashboard

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.DashboardEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IDashboardRepository
import org.slf4j.LoggerFactory

@UseCase
class GetDashboards(
    private val dashboardRepository: IDashboardRepository,
) {
    private val logger = LoggerFactory.getLogger(DeleteDashboard::class.java)

    fun execute(): List<DashboardEntity> {
        logger.info("Attempt to GET all dashboards")
        val dashboards = dashboardRepository.findAll()
        logger.info("Found ${dashboards.size} dashboards")

        return dashboards
    }
}
