package fr.gouv.cacem.monitorenv.domain.use_cases.crud.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository

@UseCase
class CreateMission(private val missionRepository: IMissionRepository) {
  @Throws(IllegalArgumentException::class)
  fun execute(mission: MissionEntity?): MissionEntity {
    require(mission != null) {
      "No mission to update"
    }
    val newMission = missionRepository.save(mission)
    return missionRepository.findMissionById(newMission.id)
  }
}
