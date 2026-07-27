package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.PatchableControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.mappers.PatchEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitResourceRepository
import org.slf4j.LoggerFactory

@UseCase
class PatchControlUnitResource(
    private val controlUnitRepository: IControlUnitResourceRepository,
    private val patchEntity: PatchEntity<ControlUnitResourceEntity, PatchableControlUnitResourceEntity>,
) {
    private val logger = LoggerFactory.getLogger(PatchControlUnitResource::class.java)

    fun execute(
        id: Int,
        patchableControlUnitResource: PatchableControlUnitResourceEntity,
    ): ControlUnitResourceEntity {
        logger.info("Attempt to PATCH control unit resource $id")
        controlUnitRepository.findById(id)?.let {
            val resourceToPatch = it.controlUnitResource
            patchEntity.execute(resourceToPatch, patchableControlUnitResource)
            val patchedControlUnitResource = controlUnitRepository.save(resourceToPatch)
            logger.info("Control unit resource $id patched")
            return patchedControlUnitResource
        }
        val errorMessage = "Control unit resource $id not found"
        logger.error(errorMessage)
        throw BackendUsageException(BackendUsageErrorCode.ENTITY_NOT_FOUND, errorMessage)
    }
}
