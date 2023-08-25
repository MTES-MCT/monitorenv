package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.NextControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.repositories.INextControlUnitRepository
import org.slf4j.LoggerFactory

@UseCase
class GetControlUnits(private val controlUnitRepository: INextControlUnitRepository) {
    private val logger = LoggerFactory.getLogger(GetControlUnits::class.java)

    fun execute(): List<NextControlUnitEntity> {
        val controlUnits = controlUnitRepository.findAll()

        logger.info("Found ${controlUnits.size} control units.")

        return controlUnits
    }
}
