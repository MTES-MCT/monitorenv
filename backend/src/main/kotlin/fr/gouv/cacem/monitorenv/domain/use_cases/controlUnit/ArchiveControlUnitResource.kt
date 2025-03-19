package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitResourceRepository
import org.slf4j.LoggerFactory

@UseCase
class ArchiveControlUnitResource(
    private val controlUnitResourceRepository: IControlUnitResourceRepository,
) {
    private val logger = LoggerFactory.getLogger(ArchiveControlUnitResource::class.java)

    fun execute(controlUnitResourceId: Int) {
        logger.info("Attempt to ARCHIVE control unit resource $controlUnitResourceId")
        controlUnitResourceRepository.archiveById(controlUnitResourceId)
        logger.info("Control unit resource $controlUnitResourceId archived")
    }
}
