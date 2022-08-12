package fr.gouv.cacem.monitorenv.domain.use_cases.crud.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionStatusEnum
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository

@UseCase
class UpdateMission(private val missionRepository: IMissionRepository) {
  @Throws(IllegalArgumentException::class)
  fun execute(mission: MissionEntity?): MissionEntity {
    require(mission != null) {
      "No mission to update"
    }

    if (mission.missionStatus == MissionStatusEnum.PENDING
      && mission.inputEndDatetimeUtc != null
      && mission.inputStartDatetimeUtc < mission.inputEndDatetimeUtc) {
        var status =  MissionStatusEnum.ENDED
        val missionToSave = mission.copy(missionStatus = status)
        return missionRepository.save(missionToSave)
    }

    if (mission.missionStatus == MissionStatusEnum.ENDED
      && mission.inputEndDatetimeUtc == null) {
        var status =  MissionStatusEnum.PENDING
        val missionToSave = mission.copy(missionStatus = status)
        return missionRepository.save(missionToSave)
    }
    return missionRepository.save(mission)
  }
}
