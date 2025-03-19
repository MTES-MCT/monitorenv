package fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IVigilanceAreaRepository
import org.slf4j.LoggerFactory

@UseCase
class GetTrigrams(
    private val vigilanceAreaRepository: IVigilanceAreaRepository,
) {
    private val logger = LoggerFactory.getLogger(GetTrigrams::class.java)

    fun execute(): List<String> {
        logger.info("Attempt to GET all vigilance areas creators trigrams")
        val trigrams = vigilanceAreaRepository.findAllTrigrams()
        logger.info("Found ${trigrams.size} trigrams")

        return trigrams
    }
}
