package fr.gouv.cacem.monitorenv.domain.use_cases.crud.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionsListEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository

import org.slf4j.LoggerFactory

@UseCase
class GetMissions(private val missionRepository: IMissionRepository) {
  private val logger = LoggerFactory.getLogger(GetMissions::class.java)

  fun execute(): MissionsListEntity {
    val missions = missionRepository.findMissions()
    logger.info("Found ${missions.size} missions ")

    return missions
  }
}
