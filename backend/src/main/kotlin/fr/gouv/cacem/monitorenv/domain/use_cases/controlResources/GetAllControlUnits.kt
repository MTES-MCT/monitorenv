package fr.gouv.cacem.monitorenv.domain.use_cases.controlResources // ktlint-disable package-name

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.controlResource.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import org.slf4j.LoggerFactory

@UseCase
class GetAllControlUnits(private val controlUnitRepository: IControlUnitRepository) {
    private val logger = LoggerFactory.getLogger(GetAllControlUnits::class.java)

    fun execute(): List<ControlUnitEntity> {
        val controlUnits = controlUnitRepository.findAll()
        logger.info("Found ${controlUnits.size} control units")

        return controlUnits
    }
}
