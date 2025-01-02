package fr.gouv.cacem.monitorenv.domain.use_cases.administration

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.exceptions.CouldNotDeleteException
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
            throw CouldNotDeleteException(
                "Cannot delete administration (ID=$administrationId) due to existing relationships.",
            )
        }

        administrationRepository.deleteById(administrationId)
        logger.info("Administration $administrationId deleted")
    }
}
