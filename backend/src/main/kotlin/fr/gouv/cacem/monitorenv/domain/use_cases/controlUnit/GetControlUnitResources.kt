package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitResourceRepository
import org.slf4j.LoggerFactory

@UseCase
class GetControlUnitResources(private val controlUnitResourceRepository: IControlUnitResourceRepository) {
    private val logger = LoggerFactory.getLogger(GetControlUnitResources::class.java)

    fun execute(): List<ControlUnitResourceEntity> {
        val controlUnitResources = controlUnitResourceRepository.findAll()

        logger.info("Found ${controlUnitResources.size} control unit administrations.")

        return controlUnitResources
    }
}
