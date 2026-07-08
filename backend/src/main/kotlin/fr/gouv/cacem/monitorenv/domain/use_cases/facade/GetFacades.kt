package fr.gouv.cacem.monitorenv.domain.use_cases.facade

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.seafront.FacadeEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IFacadeAreasRepository
import org.slf4j.LoggerFactory

@UseCase
class GetFacades(
    private val facadeRepository: IFacadeAreasRepository,
) {
    private val logger = LoggerFactory.getLogger(GetFacades::class.java)

    fun execute(): List<FacadeEntity> {
        logger.info("Attempt to GET all facades")
        val facades = facadeRepository.findAll()
        logger.info("Found ${facades.size} facades")

        return facades
    }
}
