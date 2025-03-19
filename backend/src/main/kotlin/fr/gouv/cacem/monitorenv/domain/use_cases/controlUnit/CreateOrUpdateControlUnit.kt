package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import org.slf4j.LoggerFactory

@UseCase
class CreateOrUpdateControlUnit(
    private val controlUnitRepository: IControlUnitRepository,
) {
    private val logger = LoggerFactory.getLogger(CreateOrUpdateControlUnit::class.java)

    fun execute(controlUnit: ControlUnitEntity): ControlUnitEntity {
        logger.info("Attempt to CREATE or UPDATE control unit ${controlUnit.id}")
        val controlUnitEntity = controlUnitRepository.save(controlUnit)
        logger.info("Control unit ${controlUnitEntity.id} created or updated")

        return controlUnitEntity
    }
}
