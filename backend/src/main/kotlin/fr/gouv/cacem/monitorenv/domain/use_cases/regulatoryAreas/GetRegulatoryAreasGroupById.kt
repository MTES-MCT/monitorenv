package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaGroupRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.dtos.RegulatoryAreaGroupDTO
import org.slf4j.LoggerFactory

@UseCase
class GetRegulatoryAreasGroupById(
    private val regulatoryAreaGroupRepository: IRegulatoryAreaGroupRepository,
) {
    private val logger = LoggerFactory.getLogger(GetRegulatoryAreasGroupById::class.java)

    fun execute(id: Int): RegulatoryAreaGroupDTO {
        logger.info("Attempt to GET regulatory area group $id")
        regulatoryAreaGroupRepository.findGroupById(id)?.let { return it }

        val errorMessage = "regulatory area group $id not found"
        logger.error(errorMessage)
        throw BackendUsageException(BackendUsageErrorCode.ENTITY_NOT_FOUND, errorMessage)
    }
}
