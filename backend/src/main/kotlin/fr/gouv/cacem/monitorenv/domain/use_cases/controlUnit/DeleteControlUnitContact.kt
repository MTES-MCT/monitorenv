package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitContactRepository
import org.slf4j.LoggerFactory

@UseCase
class DeleteControlUnitContact(
    private val controlUnitContactRepository: IControlUnitContactRepository,
) {
    private val logger = LoggerFactory.getLogger(DeleteControlUnitContact::class.java)

    fun execute(controlUnitContactId: Int) {
        logger.info("Attempt to DELETE control unit contact $controlUnitContactId")
        controlUnitContactRepository.deleteById(controlUnitContactId)
        logger.info("Control unit contact $controlUnitContactId deleted")
    }
}
