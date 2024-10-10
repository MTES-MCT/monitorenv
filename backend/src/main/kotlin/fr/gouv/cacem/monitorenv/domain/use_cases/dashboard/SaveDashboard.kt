package fr.gouv.cacem.monitorenv.domain.use_cases.dashboard

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.DashboardEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IDashboardRepository
import org.slf4j.LoggerFactory

@UseCase
class SaveDashboard(
    private val dashboardRepository: IDashboardRepository,
) {
    private val logger = LoggerFactory.getLogger(SaveDashboard::class.java)

    fun execute(dashboard: DashboardEntity): DashboardEntity {
        try {
            return dashboardRepository.save(dashboard)
        } catch (e: Exception) {
            val errorMessage = "dashboard ${dashboard.id} couldn't be saved"
            logger.error(errorMessage, e)
            throw BackendUsageException(BackendUsageErrorCode.ENTITY_NOT_SAVED, message = errorMessage)
        }
    }
}
