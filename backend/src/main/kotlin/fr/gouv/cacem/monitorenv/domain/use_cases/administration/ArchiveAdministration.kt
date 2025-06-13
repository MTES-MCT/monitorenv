package fr.gouv.cacem.monitorenv.domain.use_cases.administration

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IAdministrationRepository
import org.slf4j.LoggerFactory

@UseCase
class ArchiveAdministration(
    private val administrationRepository: IAdministrationRepository,
    private val canArchiveAdministration: CanArchiveAdministration,
) {
    private val logger = LoggerFactory.getLogger(ArchiveAdministration::class.java)

    fun execute(administrationId: Int) {
        logger.info("Attempt to ARCHIVE administration $administrationId")
        if (!canArchiveAdministration.execute(administrationId)) {
            val errorMessage =
                "Cannot archive administration (ID=$administrationId) due to some of its control units not being archived."
            logger.error(errorMessage)
            throw BackendUsageException(
                BackendUsageErrorCode.UNARCHIVED_CHILD,
                errorMessage,
            )
        }
        administrationRepository.archiveById(administrationId)
        logger.info("Administration $administrationId archived")
    }
}
