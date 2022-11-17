package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository

import org.slf4j.LoggerFactory
import org.springframework.data.domain.Pageable
import java.time.Instant

@UseCase
class GetMissions(private val missionRepository: IMissionRepository) {
  private val logger = LoggerFactory.getLogger(GetMissions::class.java)

  fun execute(afterDateTime: Instant,
              beforeDateTime: Instant,
              pageable: Pageable): List<MissionEntity> {
    val missions = missionRepository.findMissions(
      afterDateTime=afterDateTime,
      beforeDateTime=beforeDateTime,
      pageable=pageable)
    logger.info("Found ${missions.size} missions ")

    return missions
  }
}
