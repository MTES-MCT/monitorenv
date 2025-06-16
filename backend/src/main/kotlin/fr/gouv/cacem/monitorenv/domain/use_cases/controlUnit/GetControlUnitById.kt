package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
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

        controlUnitRepository.findFullControlUnitById(controlUnitId)?.let {
            return it
        }
        val errorMessage = "control unit $controlUnitId not found"
        logger.error(errorMessage)
        throw BackendUsageException(BackendUsageErrorCode.ENTITY_NOT_FOUND, errorMessage)
    }
}
