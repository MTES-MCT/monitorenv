package fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IVigilanceAreaRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory

@UseCase
class CreateOrUpdateVigilanceArea(
    private val vigilanceAreaRepository: IVigilanceAreaRepository,
) {
    private val logger: Logger = LoggerFactory.getLogger(DeleteVigilanceArea::class.java)

    fun execute(vigilanceArea: VigilanceAreaEntity): VigilanceAreaEntity {
        logger.info("Vigilance area: ${vigilanceArea.images}")
        return vigilanceAreaRepository.save(vigilanceArea)
    }
}
