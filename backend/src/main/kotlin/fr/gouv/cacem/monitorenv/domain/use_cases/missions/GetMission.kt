package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository

@UseCase
class GetMission(
    private val missionRepository: IMissionRepository,
) {
    fun execute(missionId: Int): MissionEntity {
        missionRepository.findById(missionId)?.let {
            return it
        }
        throw BackendUsageException(BackendUsageErrorCode.ENTITY_NOT_FOUND, "mission $missionId not found")
    }
}
