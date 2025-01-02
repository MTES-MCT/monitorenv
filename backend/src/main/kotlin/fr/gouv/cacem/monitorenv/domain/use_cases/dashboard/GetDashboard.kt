package fr.gouv.cacem.monitorenv.domain.use_cases.dashboard

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.DashboardEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IDashboardRepository
import org.slf4j.LoggerFactory
import java.util.UUID

@UseCase
class GetDashboard(
    private val dashboardRepository: IDashboardRepository,
) {
    private val logger = LoggerFactory.getLogger(GetDashboard::class.java)

    fun execute(id: UUID): DashboardEntity {
        logger.info("GET dashboard $id")
        val dashboard = dashboardRepository.findById(id)

        if (dashboard == null) {
            val errorMessage = "dashboard with id $id couldn't be found"
            logger.error(errorMessage)
            throw BackendUsageException(BackendUsageErrorCode.ENTITY_NOT_FOUND, message = errorMessage)
        }

        return dashboard
    }
}
