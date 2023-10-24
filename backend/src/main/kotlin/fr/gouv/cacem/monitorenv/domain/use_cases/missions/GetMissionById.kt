@file:Suppress("ktlint:standard:package-name")

package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository

@UseCase
class GetMissionById(private val missionRepository: IMissionRepository) {
    fun execute(missionId: Int): MissionEntity {
        return missionRepository.findById(missionId)
    }
}
