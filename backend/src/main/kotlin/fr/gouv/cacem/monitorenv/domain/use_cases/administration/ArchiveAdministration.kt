package fr.gouv.cacem.monitorenv.domain.use_cases.administration

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IAdministrationRepository

@UseCase
class ArchiveAdministration(
    private val administrationRepository: IAdministrationRepository,
    private val canArchiveAdministration: CanArchiveAdministration,
) {
    fun execute(administrationId: Int) {
        if (!canArchiveAdministration.execute(administrationId)) {
            throw BackendUsageException(
                BackendUsageErrorCode.UNARCHIVED_CHILD,
                "Cannot archive administration (ID=$administrationId) due to some of its control units not being archived.",
            )
        }

        administrationRepository.archiveById(administrationId)
    }
}
