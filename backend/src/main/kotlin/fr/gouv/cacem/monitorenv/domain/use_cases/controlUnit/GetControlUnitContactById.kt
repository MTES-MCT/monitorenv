package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitContactRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitContactDTO
import org.slf4j.LoggerFactory

@UseCase
class GetControlUnitContactById(
    private val controlUnitContactRepository: IControlUnitContactRepository,
) {
    private val logger = LoggerFactory.getLogger(GetControlUnitById::class.java)

    fun execute(controlUnitContactId: Int): FullControlUnitContactDTO {
        logger.info("GET control unit contact $controlUnitContactId")

        return controlUnitContactRepository.findById(controlUnitContactId)
    }
}
