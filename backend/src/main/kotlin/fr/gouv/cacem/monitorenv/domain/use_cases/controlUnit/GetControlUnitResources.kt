package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitResourceRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitResourceDTO
import org.slf4j.LoggerFactory

@UseCase
class GetControlUnitResources(
    private val controlUnitResourceRepository: IControlUnitResourceRepository,
) {
    private val logger = LoggerFactory.getLogger(GetControlUnitResources::class.java)

    fun execute(): List<FullControlUnitResourceDTO> {
        logger.info("Attempt to GET all control unit resources")
        val fullControlUnitResources = controlUnitResourceRepository.findAll()
        logger.info("Found ${fullControlUnitResources.size} control unit resources")

        return fullControlUnitResources
    }
}
