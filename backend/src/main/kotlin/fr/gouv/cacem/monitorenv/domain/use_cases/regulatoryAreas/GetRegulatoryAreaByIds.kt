package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.v2.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaNewRepository
import org.slf4j.LoggerFactory

@UseCase
class GetRegulatoryAreaByIds(
    private val regulatoryAreaRepository: IRegulatoryAreaNewRepository,
) {
    private val logger = LoggerFactory.getLogger(GetRegulatoryAreaById::class.java)

    fun execute(regulatoryAreaIds: List<Int>): List<RegulatoryAreaEntity> {
        logger.info("GET regulatory area $regulatoryAreaIds")

        return regulatoryAreaRepository.findAllByIds(regulatoryAreaIds)
    }
}
