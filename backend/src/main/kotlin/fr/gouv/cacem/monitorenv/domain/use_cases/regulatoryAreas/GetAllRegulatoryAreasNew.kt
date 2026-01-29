package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaRepositoryNew
import org.slf4j.LoggerFactory
import org.springframework.transaction.annotation.Transactional

@UseCase
class GetAllRegulatoryAreasNew(
    private val regulatoryAreaRepository: IRegulatoryAreaRepositoryNew,
) {
    private val logger = LoggerFactory.getLogger(GetAllRegulatoryAreasNew::class.java)

    @Transactional(
        transactionManager = "cacemTransactionManager",
        readOnly = true,
    )
    fun execute(): List<RegulatoryAreaEntity> {
        logger.info("Attempt to GET all regulatory areas")
        val regulatoryAreas = regulatoryAreaRepository.findAll()
        logger.info("Found ${regulatoryAreas.size} regulatory areas")

        return regulatoryAreas
    }
}
