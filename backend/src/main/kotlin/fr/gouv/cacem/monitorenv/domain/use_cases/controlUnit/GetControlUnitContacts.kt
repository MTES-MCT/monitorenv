package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitContactRepository
import org.slf4j.LoggerFactory

@UseCase
class GetControlUnitContacts(private val controlUnitContactRepository: IControlUnitContactRepository) {
    private val logger = LoggerFactory.getLogger(GetControlUnitContacts::class.java)

    fun execute(): List<ControlUnitContactEntity> {
        val controlUnitContacts = controlUnitContactRepository.findAll()

        logger.info("Found ${controlUnitContacts.size} control unit administrations.")

        return controlUnitContacts
    }
}
