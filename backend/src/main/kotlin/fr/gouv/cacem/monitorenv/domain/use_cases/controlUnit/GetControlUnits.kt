package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitDTO
import org.slf4j.LoggerFactory

@UseCase
class GetControlUnits(private val controlUnitRepository: IControlUnitRepository) {
    private val logger = LoggerFactory.getLogger(GetControlUnits::class.java)

    fun execute(): List<FullControlUnitDTO> {
        logger.info("Attempt to GET all control units")
        val fullControlUnits = controlUnitRepository.findAll()
        logger.info("Found ${fullControlUnits.size} control units.")

        return fullControlUnits
    }
}
