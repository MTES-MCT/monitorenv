package fr.gouv.cacem.monitorenv.domain.use_cases.actions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.PatchableEnvActionEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.mappers.PatchEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IEnvActionRepository
import java.util.*

@UseCase
class PatchEnvAction(
    private val envActionRepository: IEnvActionRepository,
    private val patchEnvAction: PatchEntity<EnvActionEntity, PatchableEnvActionEntity>,
) {
    fun execute(
        id: UUID,
        patchableEnvActionEntity: PatchableEnvActionEntity,
    ): EnvActionEntity {
        envActionRepository.findById(id)?.let {
            patchEnvAction.execute(it, patchableEnvActionEntity)
            return envActionRepository.save(it)
        }
        throw BackendUsageException(BackendUsageErrorCode.ENTITY_NOT_FOUND, "envAction $id not found")
    }
}
