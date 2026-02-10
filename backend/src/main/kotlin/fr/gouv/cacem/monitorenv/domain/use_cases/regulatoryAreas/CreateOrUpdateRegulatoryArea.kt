package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaNewEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaNewRepository
import org.slf4j.LoggerFactory

@UseCase
class CreateOrUpdateRegulatoryArea(
    private val regulatoryAreaRepository: IRegulatoryAreaNewRepository,
) {
    private val logger = LoggerFactory.getLogger(CreateOrUpdateRegulatoryArea::class.java)

    fun execute(regulatoryArea: RegulatoryAreaNewEntity): RegulatoryAreaNewEntity {
        logger.info("Attempt to CREATE or UPDATE regulatory area ${regulatoryArea.id}")

        try {
            val regulatoryArea = regulatoryAreaRepository.save(regulatoryArea)
            logger.info("RegulatoryArea ${regulatoryArea.id} created or updated")
            return regulatoryArea
        } catch (e: Exception) {
            val errorMessage = "regulatoryArea ${regulatoryArea.id} couldn't be saved"
            logger.error(errorMessage, e)
            throw BackendUsageException(BackendUsageErrorCode.ENTITY_NOT_SAVED, message = errorMessage)
        }
    }
}
