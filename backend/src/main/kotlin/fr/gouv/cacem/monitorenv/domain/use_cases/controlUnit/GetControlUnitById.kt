package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitDTO
import org.slf4j.LoggerFactory

@UseCase
class GetControlUnitById(
    private val controlUnitRepository: IControlUnitRepository,
) {
    private val logger = LoggerFactory.getLogger(GetControlUnitById::class.java)

    fun execute(controlUnitId: Int): FullControlUnitDTO {
        logger.info("GET control unit $controlUnitId")

        return controlUnitRepository.findFullControlUnitById(controlUnitId)
    }
}
