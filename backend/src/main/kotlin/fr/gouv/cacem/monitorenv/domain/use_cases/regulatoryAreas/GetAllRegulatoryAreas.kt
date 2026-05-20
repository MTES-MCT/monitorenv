package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaGroupRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.dtos.RegulatoryAreaGroupDTO
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.AreaTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.SearchFilters
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaRepository
import org.slf4j.LoggerFactory

@UseCase
class GetAllRegulatoryAreas(
    private val regulatoryAreaGroupRepository: IRegulatoryAreaGroupRepository,
) {
    private val logger = LoggerFactory.getLogger(GetAllRegulatoryAreas::class.java)

    fun execute(filters: SearchFilters): AllRegulatoryAreasAndTotal {
        logger.info("Attempt to GET all regulatory areas")

        val allGroups =
            regulatoryAreaGroupRepository.findAll(
                filters = filters,
            )

        val totalCount = allGroups.flatMap { it.areas }.count().toLong()

        logger.info("Found $totalCount regulatory areas across ${allGroups.size} layers")

        return Pair(allGroups, totalCount)
    }
}

typealias AllRegulatoryAreasAndTotal = Pair<List<RegulatoryAreaGroupDTO>, Long>
