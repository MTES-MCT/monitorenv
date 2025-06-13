package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitResourceRepository
import org.slf4j.LoggerFactory

@UseCase
class DeleteControlUnitResource(
    private val canDeleteControlUnitResource: CanDeleteControlUnitResource,
    private val controlUnitResourceRepository: IControlUnitResourceRepository,
) {
    private val logger = LoggerFactory.getLogger(DeleteControlUnitResource::class.java)

    fun execute(controlUnitResourceId: Int) {
        logger.info("Attempt to DELETE control unit resource $controlUnitResourceId")

        if (!canDeleteControlUnitResource.execute(controlUnitResourceId)) {
            val errorMessage =
                "Cannot delete control unit resource (ID=$controlUnitResourceId) due to existing relationships."
            logger.error(errorMessage)
            throw BackendUsageException(BackendUsageErrorCode.CANNOT_DELETE_ENTITY, errorMessage)
        }
        controlUnitResourceRepository.deleteById(controlUnitResourceId)
        logger.info("Control unit resource $controlUnitResourceId deleted")
    }
}
