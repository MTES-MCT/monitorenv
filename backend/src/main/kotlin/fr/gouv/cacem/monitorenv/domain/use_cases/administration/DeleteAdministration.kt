package fr.gouv.cacem.monitorenv.domain.use_cases.administration

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.exceptions.CouldNotDeleteException
import fr.gouv.cacem.monitorenv.domain.repositories.IAdministrationRepository

@UseCase
class DeleteAdministration(
    private val administrationRepository: IAdministrationRepository,
    private val canDeleteAdministration: CanDeleteAdministration,
) {
    fun execute(administrationId: Int) {
        if (!canDeleteAdministration.execute(administrationId)) {
            throw CouldNotDeleteException(
                "Cannot delete administration (ID=$administrationId) due to existing relationships.",
            )
        }

        administrationRepository.deleteById(administrationId)
    }
}
