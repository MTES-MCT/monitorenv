package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.PatchableMissionEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.mappers.PatchEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO

@UseCase
class PatchMission(
    private val missionRepository: IMissionRepository,
    private val patchEntity: PatchEntity<MissionEntity, PatchableMissionEntity>,
) {
    fun execute(
        id: Int,
        patchableMissionEntity: PatchableMissionEntity,
    ): MissionDTO {
        missionRepository.findById(id)?.let {
            patchEntity.execute(it, patchableMissionEntity)
            return missionRepository.save(it)
        }
        throw BackendUsageException(BackendUsageErrorCode.ENTITY_NOT_FOUND, "mission $id not found")
    }
}
