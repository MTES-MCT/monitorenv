package fr.gouv.cacem.monitorenv.domain.use_cases.dashboard

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.DashboardEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IDashboardRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IFacadeAreasRepository
import org.slf4j.LoggerFactory

@UseCase
class SaveDashboard(
    private val dashboardRepository: IDashboardRepository,
    private val facadeAreasRepository: IFacadeAreasRepository,
) {
    private val logger = LoggerFactory.getLogger(SaveDashboard::class.java)

    fun execute(dashboard: DashboardEntity): DashboardEntity {
        logger.info("Attempt to CREATE or UPDATE dashboard ${dashboard.id}")
        try {
            val seaFront = facadeAreasRepository.findFacadeFromGeometry(dashboard.geom)
            val savedDashboard = dashboardRepository.save(dashboard.copy(seaFront = seaFront))
            logger.info("Dashboard ${savedDashboard.id} created or updated")
            return savedDashboard
        } catch (e: Exception) {
            val errorMessage = "dashboard ${dashboard.id} couldn't be saved"
            logger.error(errorMessage, e)
            throw BackendUsageException(BackendUsageErrorCode.ENTITY_NOT_SAVED, message = errorMessage)
        }
    }
}
