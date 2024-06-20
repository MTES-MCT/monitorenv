package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository

@UseCase
class PatchMission(
    private val missionRepository: IMissionRepository,
//    private val mergeMissionEntity: MergeMissionEntity,
) {
//
//    fun execute(id: Int, patchableMissionEntity: PatchableMissionEntity): MissionEntity {
//        missionRepository.findById(id)?.let {
//            return envActionRepository.save(mergeEnvActionEntity.execute(it, patchableEnvActionEntity))
//        }
//        throw BackendUsageException(BackendUsageErrorCode.ENTITY_NOT_FOUND, "mission $id not found")
//    }
}
