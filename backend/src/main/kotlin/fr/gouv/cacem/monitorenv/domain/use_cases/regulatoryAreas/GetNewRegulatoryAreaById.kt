package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaNewEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaNewRepository
import org.slf4j.LoggerFactory

@UseCase
class GetNewRegulatoryAreaById(
    private val regulatoryAreaRepository: IRegulatoryAreaNewRepository,
) {
    private val logger = LoggerFactory.getLogger(GetNewRegulatoryAreaById::class.java)

    fun execute(regulatoryAreaId: Int): RegulatoryAreaNewEntity? {
        logger.info("GET regulatory area $regulatoryAreaId")

        return regulatoryAreaRepository.findById(regulatoryAreaId)
    }
}
