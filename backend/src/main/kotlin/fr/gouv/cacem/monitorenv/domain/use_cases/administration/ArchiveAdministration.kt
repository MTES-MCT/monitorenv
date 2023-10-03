package fr.gouv.cacem.monitorenv.domain.use_cases.administration

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IAdministrationRepository

@UseCase
class ArchiveAdministration(private val administrationRepository: IAdministrationRepository) {
    fun execute(administrationId: Int) {
        administrationRepository.archiveById(administrationId)
    }
}
