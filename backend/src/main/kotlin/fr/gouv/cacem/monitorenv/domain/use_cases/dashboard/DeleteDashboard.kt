package fr.gouv.cacem.monitorenv.domain.use_cases.dashboard

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IDashboardRepository
import org.slf4j.LoggerFactory
import java.util.UUID

@UseCase
class DeleteDashboard(
    private val dashboardRepository: IDashboardRepository,
) {
    private val logger = LoggerFactory.getLogger(DeleteDashboard::class.java)

    fun execute(id: UUID) {
        logger.info("Attempt to DELETE dashboard $id")
        dashboardRepository.delete(id)
        logger.info("Dashboard $id deleted")
    }
}
