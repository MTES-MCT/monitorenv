package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.PatchableMissionEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.interactors.MergeMissionEntity

@UseCase
class PatchMission(
    private val missionRepository: IMissionRepository,
    private val mergeMissionEntity: MergeMissionEntity,
) {

    fun execute(id: Int, patchableMissionEntity: PatchableMissionEntity): MissionDTO {
        missionRepository.findById(id)?.let {
            return missionRepository.save(mergeMissionEntity.execute(it, patchableMissionEntity))
        }
        throw BackendUsageException(BackendUsageErrorCode.ENTITY_NOT_FOUND, "mission $id not found")
    }
}
