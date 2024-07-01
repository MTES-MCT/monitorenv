package fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IVigilanceAreaRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory

@UseCase
class DeleteVigilanceArea(private val vigilanceAreaRepository: IVigilanceAreaRepository) {
    private val logger: Logger = LoggerFactory.getLogger(DeleteVigilanceArea::class.java)

    @Throws(IllegalArgumentException::class)
    fun execute(id: Int?) {
        logger.info("Delete vigilance area: $id")

        require(id != null) { "No vigilance area to delete" }
        vigilanceAreaRepository.delete(id)
    }
}
