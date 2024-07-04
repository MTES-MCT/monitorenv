package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository

@UseCase
class GetMissionsByIds(private val missionRepository: IMissionRepository) {
    fun execute(ids: List<Int>): List<MissionEntity> {
        return missionRepository.findByIds(ids)
    }
}
