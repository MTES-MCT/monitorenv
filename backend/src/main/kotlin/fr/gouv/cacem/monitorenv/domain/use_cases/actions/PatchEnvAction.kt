package fr.gouv.cacem.monitorenv.domain.use_cases.actions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.PatchableEnvActionEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.mappers.PatchEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IEnvActionRepository
import fr.gouv.cacem.monitorenv.domain.validators.mission.EnvActionValidator
import org.slf4j.LoggerFactory
import java.util.UUID

@UseCase
class PatchEnvAction(
    private val envActionRepository: IEnvActionRepository,
    private val patchEnvAction: PatchEntity<EnvActionEntity, PatchableEnvActionEntity>,
    private val envActionValidator: EnvActionValidator,
) {
    private val logger = LoggerFactory.getLogger(PatchEnvAction::class.java)

    fun execute(
        id: UUID,
        patchableEnvActionEntity: PatchableEnvActionEntity,
    ): EnvActionEntity {
        logger.info("Attempt to PATCH envaction $id")
        envActionRepository.findById(id)?.let {
            patchEnvAction.execute(it, patchableEnvActionEntity)
            envActionValidator.validate(it)
            val patchedEnvAction = envActionRepository.save(it)
            logger.info("envaction $id patched")
            return patchedEnvAction
        }
        val errorMessage = "envAction $id not found"
        logger.error(errorMessage)
        throw BackendUsageException(BackendUsageErrorCode.ENTITY_NOT_FOUND, errorMessage)
    }
}
