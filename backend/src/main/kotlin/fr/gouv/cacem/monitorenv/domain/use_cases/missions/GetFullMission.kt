package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO

@UseCase
class GetFullMission(
    private val missionRepository: IMissionRepository,
) {
    fun execute(missionId: Int): MissionDTO {
        missionRepository.findFullMissionById(missionId)?.let {
            return it
        }
        throw BackendUsageException(BackendUsageErrorCode.ENTITY_NOT_FOUND, "mission $missionId not found")
    }
}
