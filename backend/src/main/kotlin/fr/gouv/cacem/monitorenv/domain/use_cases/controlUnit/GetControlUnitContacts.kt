package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitContactRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitContactDTO
import org.slf4j.LoggerFactory

@UseCase
class GetControlUnitContacts(private val controlUnitContactRepository: IControlUnitContactRepository) {
    private val logger = LoggerFactory.getLogger(GetControlUnitContacts::class.java)

    fun execute(): List<FullControlUnitContactDTO> {
        val controlUnitContacts = controlUnitContactRepository.findAll()

        logger.info("Found ${controlUnitContacts.size} control unit administrations.")

        return controlUnitContacts
    }
}
