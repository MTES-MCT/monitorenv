package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitResourceRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitResourceDTO
import org.slf4j.LoggerFactory

@UseCase
class GetControlUnitResourceById(private val controlUnitResourceRepository: IControlUnitResourceRepository) {
    private val logger = LoggerFactory.getLogger(GetControlUnitById::class.java)

    fun execute(controlUnitResourceId: Int): FullControlUnitResourceDTO {
        logger.info("GET control unit resource $controlUnitResourceId")
        val controlUnitResourceDTO = controlUnitResourceRepository.findById(controlUnitResourceId)

        return controlUnitResourceDTO
    }
}
