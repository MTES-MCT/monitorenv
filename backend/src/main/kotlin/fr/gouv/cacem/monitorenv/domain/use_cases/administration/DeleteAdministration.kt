package fr.gouv.cacem.monitorenv.domain.use_cases.administration

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IAdministrationRepository
import org.slf4j.LoggerFactory

@UseCase
class DeleteAdministration(
    private val administrationRepository: IAdministrationRepository,
    private val canDeleteAdministration: CanDeleteAdministration,
) {
    private val logger = LoggerFactory.getLogger(DeleteAdministration::class.java)

    fun execute(administrationId: Int) {
        logger.info("Attempt to DELETE administration $administrationId")

        if (!canDeleteAdministration.execute(administrationId)) {
            val errorMessage = "Cannot delete administration (ID=$administrationId) due to existing relationships."
            logger.error(errorMessage)
            throw BackendUsageException(BackendUsageErrorCode.CANNOT_DELETE_ENTITY, errorMessage)
        }

        administrationRepository.deleteById(administrationId)
        logger.info("Administration $administrationId deleted")
    }
}
