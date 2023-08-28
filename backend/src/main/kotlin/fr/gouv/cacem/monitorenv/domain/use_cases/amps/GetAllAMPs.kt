package fr.gouv.cacem.monitorenv.domain.use_cases.amps

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.amp.AMPEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IAMPRepository
import org.slf4j.LoggerFactory

@UseCase
class GetAllAMPs(private val ampRepository: IAMPRepository) {
    private val logger = LoggerFactory.getLogger(GetAllAMPs::class.java)

    fun execute(): List<AMPEntity> {
        val amps = ampRepository.findAll()
        logger.info("Found ${amps.size} amps")

        return amps
    }
}
