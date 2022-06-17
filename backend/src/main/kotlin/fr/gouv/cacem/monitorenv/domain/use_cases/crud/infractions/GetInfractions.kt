package fr.gouv.cacem.monitorenv.domain.use_cases.crud.infractions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.infractions.InfractionEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IInfractionRepository

import org.slf4j.LoggerFactory

@UseCase
class GetInfractions(private val infractionRepository: IInfractionRepository) {
  private val logger = LoggerFactory.getLogger(GetInfractions::class.java)

  fun execute(): List<InfractionEntity> {
    val infractions = infractionRepository.findInfractions()
    logger.info("Found ${infractions.size} infractions ")

    return infractions
  }
}
