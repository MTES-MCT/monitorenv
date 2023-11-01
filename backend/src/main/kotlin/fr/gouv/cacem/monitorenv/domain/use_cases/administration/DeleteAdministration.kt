package fr.gouv.cacem.monitorenv.domain.use_cases.administration

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IAdministrationRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.exceptions.ForeignKeyConstraintException

@UseCase
class DeleteAdministration(
    private val administrationRepository: IAdministrationRepository,
    private val canDeleteAdministration: CanDeleteAdministration
) {
    fun execute(administrationId: Int) {
        if (!canDeleteAdministration.execute(administrationId)) {
            throw ForeignKeyConstraintException(
                "Cannot delete administration (ID=$administrationId) due to existing relationships."
            )
        }

        administrationRepository.deleteById(administrationId)
    }
}
