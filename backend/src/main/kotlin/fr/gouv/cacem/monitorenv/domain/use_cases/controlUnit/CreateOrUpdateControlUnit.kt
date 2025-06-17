package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import org.slf4j.LoggerFactory

@UseCase
class CreateOrUpdateControlUnit(
    private val controlUnitRepository: IControlUnitRepository,
) {
    private val logger = LoggerFactory.getLogger(CreateOrUpdateControlUnit::class.java)

    fun execute(controlUnit: ControlUnitEntity): ControlUnitEntity {
        logger.info("Attempt to CREATE or UPDATE control unit ${controlUnit.id}")
        try {
            val controlUnitEntity = controlUnitRepository.save(controlUnit)
            logger.info("Control unit ${controlUnitEntity.id} created or updated")

            return controlUnitEntity
        } catch (ex: Exception) {
            val errorMessage =
                "Unable to save control unit with `id` = ${controlUnit.id}."
            logger.error(errorMessage, ex)
            throw BackendUsageException(BackendUsageErrorCode.ENTITY_NOT_SAVED, errorMessage)
        }
    }
}
