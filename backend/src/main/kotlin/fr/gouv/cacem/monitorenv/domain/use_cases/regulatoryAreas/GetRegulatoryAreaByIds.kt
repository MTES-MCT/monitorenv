package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.AxisEnum
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaRepository
import org.slf4j.LoggerFactory

@UseCase
class GetRegulatoryAreaByIds(
    private val regulatoryAreaRepository: IRegulatoryAreaRepository,
) {
    private val logger = LoggerFactory.getLogger(GetRegulatoryAreaByIds::class.java)

    fun execute(
        regulatoryAreaIds: List<Int>,
        axis: AxisEnum,
    ): List<RegulatoryAreaEntity> {
        logger.info("GET regulatory area $regulatoryAreaIds")

        return regulatoryAreaRepository.findAllByIds(regulatoryAreaIds, axis)
    }
}
