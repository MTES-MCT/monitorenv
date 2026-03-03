package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.v2.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaNewRepository
import org.slf4j.LoggerFactory

@UseCase
class GetAllNewRegulatoryAreas(
    private val regulatoryAreaRepository: IRegulatoryAreaNewRepository,
) {
    private val logger = LoggerFactory.getLogger(GetAllRegulatoryAreas::class.java)

    fun execute(
        controlPlan: String?,
        searchQuery: String?,
        seaFronts: List<String>?,
        tags: List<Int>?,
        themes: List<Int>?,
    ): AllRegulatoryAreasAndTotal {
        logger.info("Attempt to GET all regulatory areas")

        val allAreas =
            regulatoryAreaRepository.findAll(
                controlPlan = controlPlan,
                query = searchQuery,
                seaFronts = seaFronts,
                tags = tags,
                themes = themes,
            )

        val totalCount = allAreas.size.toLong()
        val groupedAreas = allAreas.groupBy { it.layerName }

        logger.info("Found $totalCount regulatory areas across ${groupedAreas.size} layers")

        return Pair(groupedAreas, totalCount)
    }
}

typealias AllRegulatoryAreasAndTotal = Pair<Map<String?, List<RegulatoryAreaEntity>>, Long>
