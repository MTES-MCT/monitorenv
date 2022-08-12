package fr.gouv.cacem.monitorenv.domain.use_cases.crud.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository

@UseCase
class DeleteMission(private val missionRepository: IMissionRepository) {
  @Throws(IllegalArgumentException::class)
  fun execute(missionId: Int?) {
    require(missionId != null) {
      "No mission to delete"
    }
    return missionRepository.delete(missionId)
  }
}
