package fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IVigilanceAreaRepository
import org.slf4j.LoggerFactory

@UseCase
class GetVigilanceAreaById(private val vigilanceAreaRepository: IVigilanceAreaRepository) {
    private val logger = LoggerFactory.getLogger(GetVigilanceAreas::class.java)

    fun execute(vigilanceAreaId: Int): VigilanceAreaEntity? {
        logger.info("GET vigilance area $vigilanceAreaId")
        return vigilanceAreaRepository.findById(vigilanceAreaId)
    }
}
