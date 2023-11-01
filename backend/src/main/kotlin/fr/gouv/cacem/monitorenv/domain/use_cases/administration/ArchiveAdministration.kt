package fr.gouv.cacem.monitorenv.domain.use_cases.administration

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IAdministrationRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.exceptions.UnarchivedChildException

@UseCase
class ArchiveAdministration(
    private val administrationRepository: IAdministrationRepository,
    private val canArchiveAdministration: CanArchiveAdministration
) {
    fun execute(administrationId: Int) {
        if (!canArchiveAdministration.execute(administrationId)) {
            throw UnarchivedChildException(
                "Cannot archive administration (ID=$administrationId) due to some of its control units not being archived."
            )
        }

        administrationRepository.archiveById(administrationId)
    }
}
