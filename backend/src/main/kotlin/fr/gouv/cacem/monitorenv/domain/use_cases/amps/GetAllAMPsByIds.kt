package fr.gouv.cacem.monitorenv.domain.use_cases.amps

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.amp.AMPEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IAMPRepository
import org.slf4j.LoggerFactory

@UseCase
class GetAllAMPsByIds(
    private val ampRepository: IAMPRepository,
) {
    private val logger = LoggerFactory.getLogger(GetAllAMPsByIds::class.java)

    fun execute(
        ids: List<Int>,
        axis: String,
    ): List<AMPEntity> {
        logger.info("Attempt to GET AMPs with ids:  $ids")
        val amps = ampRepository.findAllByIds(ids, axis)
        logger.info("Found ${amps.size} AMPs")

        return amps
    }
}
