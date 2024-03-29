package fr.gouv.cacem.monitorenv.domain.use_cases.administration

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IAdministrationRepository

@UseCase
class CanDeleteAdministration(private val administrationRepository: IAdministrationRepository) {
    fun execute(administrationId: Int): Boolean {
        val fullAdministration = administrationRepository.findById(administrationId)

        return fullAdministration.controlUnits.isEmpty()
    }
}
