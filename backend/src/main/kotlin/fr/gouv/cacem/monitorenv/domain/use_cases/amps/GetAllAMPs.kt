package fr.gouv.cacem.monitorenv.domain.use_cases.amps

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.amp.AMPEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IAMPRepository
import org.slf4j.LoggerFactory

@UseCase
class GetAllAMPs(
    private val ampRepository: IAMPRepository,
) {
    private val logger = LoggerFactory.getLogger(GetAllAMPs::class.java)

    fun execute(withGeometry: Boolean): List<AMPEntity> {
        logger.info("Attempt to GET all AMPs")
        val amps = ampRepository.findAll(withGeometry)
        logger.info("Found ${amps.size} AMPs")

        return amps
    }
}
