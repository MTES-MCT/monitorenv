package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitResourceRepository
import org.slf4j.LoggerFactory

@UseCase
class CreateOrUpdateControlUnitResource(
    private val controlUnitResourceRepository: IControlUnitResourceRepository,
) {
    private val logger = LoggerFactory.getLogger(CreateOrUpdateControlUnitResource::class.java)

    fun execute(controlUnitResource: ControlUnitResourceEntity): ControlUnitResourceEntity {
        try {
            logger.info("Attempt to CREATE or UPDATE control unit resource ${controlUnitResource.id}")
            val controlUnitResourceEntity = controlUnitResourceRepository.save(controlUnitResource)
            logger.info("Control unit resource ${controlUnitResourceEntity.id} created or updated")

            return controlUnitResourceEntity
        } catch (e: Exception) {
            val errorMessage =
                "Unable to save control unit resource with `id` = ${controlUnitResource.id}."
            logger.error(errorMessage, e)
            throw BackendUsageException(BackendUsageErrorCode.ENTITY_NOT_SAVED, errorMessage)
        }
    }
}
