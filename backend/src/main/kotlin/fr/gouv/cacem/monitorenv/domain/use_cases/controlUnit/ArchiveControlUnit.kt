package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import org.slf4j.LoggerFactory

@UseCase
class ArchiveControlUnit(private val controlUnitRepository: IControlUnitRepository) {
    private val logger = LoggerFactory.getLogger(ArchiveControlUnit::class.java)

    fun execute(controlUnitId: Int) {
        logger.info("Attempt to ARCHIVE control unit $controlUnitId")
        controlUnitRepository.archiveById(controlUnitId)
        logger.info("Control unit $controlUnitId archived")
    }
}
