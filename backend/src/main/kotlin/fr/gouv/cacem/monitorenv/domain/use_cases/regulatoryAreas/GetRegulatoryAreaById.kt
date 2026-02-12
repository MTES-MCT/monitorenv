@file:Suppress("ktlint:standard:package-name")

package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaRepository
import org.slf4j.LoggerFactory

@UseCase
class GetRegulatoryAreaById(
    private val regulatoryAreaRepository: IRegulatoryAreaRepository,
) {
    private val logger = LoggerFactory.getLogger(GetRegulatoryAreaById::class.java)

    fun execute(regulatoryAreaId: Int): RegulatoryAreaEntity? {
        logger.info("GET regulatory area $regulatoryAreaId")

        return regulatoryAreaRepository.findById(regulatoryAreaId)
    }
}
