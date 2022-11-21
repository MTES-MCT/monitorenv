package fr.gouv.cacem.monitorenv.domain.use_cases.controlResources

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.controlResources.ControlResourceEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlResourceRepository
import org.slf4j.LoggerFactory

@UseCase
class GetControlResources(private val controlResourceRepository: IControlResourceRepository) {
    private val logger = LoggerFactory.getLogger(GetControlResources::class.java)

    fun execute(): List<ControlResourceEntity> {
        val controlResources = controlResourceRepository.findControlResources()
        logger.info("Found ${controlResources.size} control resources ")

        return controlResources
    }
}
