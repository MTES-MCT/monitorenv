package fr.gouv.cacem.monitorenv.domain.use_cases.missions // ktlint-disable package-name

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository

@UseCase
class GetMissionById(private val missionRepository: IMissionRepository) {
    fun execute(missionId: Int): MissionEntity {
        return missionRepository.findMissionById(missionId)
    }
}
