package fr.gouv.cacem.monitorenv.domain.use_cases.actions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IEnvActionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.interactors.IDataMerger
import java.util.UUID

@UseCase
class PatchEnvAction(
    private val envActionRepository: IEnvActionRepository,
    private val mergeData: IDataMerger<EnvActionEntity>,
) {

    fun execute(id: UUID, partialEnvAction: EnvActionEntity): EnvActionEntity {

        envActionRepository.findById(id)?.let {
            return envActionRepository.save(mergeData.merge(it, partialEnvAction))
        }

        throw BackendUsageException(BackendUsageErrorCode.ENTITY_NOT_FOUND, "envAction $id not found")
    }
}
