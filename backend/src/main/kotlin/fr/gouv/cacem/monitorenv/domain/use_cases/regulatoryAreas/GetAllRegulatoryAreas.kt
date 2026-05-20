package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.SearchFilters
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaRepository
import org.slf4j.LoggerFactory

@UseCase
class GetAllRegulatoryAreas(
    private val regulatoryAreaRepository: IRegulatoryAreaRepository,
) {
    private val logger = LoggerFactory.getLogger(GetAllRegulatoryAreas::class.java)

    fun execute(filters: SearchFilters): AllRegulatoryAreasAndTotal {
        logger.info("Attempt to GET all regulatory areas")

        val allAreas =
            regulatoryAreaRepository.findAll(
                filters = filters,
            )

        val totalCount = allAreas.size.toLong()
        val groupedAreas = allAreas.groupBy { it.layerName }

        logger.info("Found $totalCount regulatory areas across ${groupedAreas.size} layers")

        return Pair(groupedAreas, totalCount)
    }
}

typealias AllRegulatoryAreasAndTotal = Pair<Map<String?, List<RegulatoryAreaEntity>>, Long>
