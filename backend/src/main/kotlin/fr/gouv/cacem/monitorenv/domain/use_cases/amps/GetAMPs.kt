package fr.gouv.cacem.monitorenv.domain.use_cases.amps

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.amp.AMPEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IAMPRepository
import org.slf4j.LoggerFactory

@UseCase
class GetAMPs(private val ampRepository: IAMPRepository) {
  private val logger = LoggerFactory.getLogger(GetAMPs::class.java)

  fun execute(): List<AMPEntity> {
    val amps = ampRepository.findAMPs()
    logger.info("Found ${amps.size} amps")

    return amps
  }
}