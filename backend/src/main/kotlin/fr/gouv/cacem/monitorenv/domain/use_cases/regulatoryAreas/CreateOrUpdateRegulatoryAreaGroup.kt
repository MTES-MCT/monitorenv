package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaGroupEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaGroupRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.dtos.RegulatoryAreaGroupDTO
import org.slf4j.LoggerFactory

@UseCase
class CreateOrUpdateRegulatoryAreaGroup(
    private val regulatoryAreaGroupRepository: IRegulatoryAreaGroupRepository,
) {
    private val logger = LoggerFactory.getLogger(CreateOrUpdateRegulatoryAreaGroup::class.java)

    fun execute(regulatoryAreaGroup: RegulatoryAreaGroupEntity): RegulatoryAreaGroupDTO {
        logger.info("Attempt to CREATE or UPDATE regulatory area group ${regulatoryAreaGroup.type}")

        try {
            val savedRegulatoryAreaGroup = regulatoryAreaGroupRepository.save(regulatoryAreaGroup)
            logger.info("Regulatory Area group ${regulatoryAreaGroup.type} created or updated")
            return savedRegulatoryAreaGroup
        } catch (e: Exception) {
            val errorMessage = "Regulatory Area group ${regulatoryAreaGroup.type} couldn't be saved"
            logger.error(errorMessage, e)
            throw BackendUsageException(BackendUsageErrorCode.ENTITY_NOT_SAVED, message = errorMessage)
        }
    }
}
