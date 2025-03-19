package fr.gouv.cacem.monitorenv.domain.use_cases.administration

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IAdministrationRepository
import org.slf4j.LoggerFactory

@UseCase
class CanDeleteAdministration(
    private val administrationRepository: IAdministrationRepository,
) {
    private val logger = LoggerFactory.getLogger(CanDeleteAdministration::class.java)

    fun execute(administrationId: Int): Boolean {
        logger.info("Can administration $administrationId be deleted")
        val fullAdministration = administrationRepository.findById(administrationId)

        return fullAdministration.controlUnits.isEmpty()
    }
}
