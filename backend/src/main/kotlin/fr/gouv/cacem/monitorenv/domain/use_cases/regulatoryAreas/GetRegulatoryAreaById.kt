package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaRepository
import org.slf4j.LoggerFactory

@UseCase
class GetRegulatoryAreaById(
    private val regulatoryAreaRepository: IRegulatoryAreaRepository,
) {
    private val logger = LoggerFactory.getLogger(GetRegulatoryAreaById::class.java)

    fun execute(id: Int): RegulatoryAreaEntity {
        logger.info("GET regulatory area $id")

        regulatoryAreaRepository.findById(id)?.let { return it }

        throw BackendUsageException(
            BackendUsageErrorCode.ENTITY_NOT_FOUND,
            "regulatory area $id not found",
        )
    }
}
