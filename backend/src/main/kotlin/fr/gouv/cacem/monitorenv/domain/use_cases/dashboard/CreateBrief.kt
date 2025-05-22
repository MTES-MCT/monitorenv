package fr.gouv.cacem.monitorenv.domain.use_cases.dashboard

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.BriefEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.BriefFileEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.file.dashboard.IDashboardFile
import org.slf4j.LoggerFactory

@UseCase
class CreateBrief(
    private val dashboardFile: IDashboardFile,
) {
    private val logger = LoggerFactory.getLogger(CreateBrief::class.java)

    fun execute(brief: BriefEntity): BriefFileEntity {
        logger.info("Attempt to CREATE EDITABLE BRIEF dashboard")
        try {
            return dashboardFile.createEditableBrief(brief)
        } catch (e: Exception) {
            val errorMessage = "Brief with id ${brief.dashboard.id} couldn't be created"
            logger.error(errorMessage)
            throw BackendUsageException(BackendUsageErrorCode.ENTITY_NOT_SAVED, message = errorMessage)
        }
    }
}
