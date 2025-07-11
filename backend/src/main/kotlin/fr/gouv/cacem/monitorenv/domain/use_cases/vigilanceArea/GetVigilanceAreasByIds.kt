package fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IVigilanceAreaRepository
import org.slf4j.LoggerFactory

@UseCase
class GetVigilanceAreasByIds(
    private val vigilanceAreaRepository: IVigilanceAreaRepository,
) {
    private val logger = LoggerFactory.getLogger(GetVigilanceAreasByIds::class.java)

    fun execute(vigilanceAreaIds: List<Int>): List<VigilanceAreaEntity>? {
        logger.info("Attempt to GET vigilance areas withs ids: $vigilanceAreaIds")
        val vigilanceAreas = vigilanceAreaRepository.findAllById(vigilanceAreaIds)
        logger.info("Found ${vigilanceAreas.size} vigilance areas")
        return vigilanceAreas
    }
}
