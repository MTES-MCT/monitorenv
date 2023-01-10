package fr.gouv.cacem.monitorenv.domain.use_cases.controlResources

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.controlResources.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import org.slf4j.LoggerFactory

@UseCase
class GetControlUnits(private val controlUnitRepository: IControlUnitRepository) {
    private val logger = LoggerFactory.getLogger(GetControlUnits::class.java)

    fun execute(): List<ControlUnitEntity> {
        val controlUnits = controlUnitRepository.findControlUnits()
        logger.info("Found ${controlUnits.size} control units")

        return controlUnits
    }
}
