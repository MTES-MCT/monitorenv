package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.AreaTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaRepository
import org.slf4j.LoggerFactory

@UseCase
class GetAllRegulatoryAreas(
    private val regulatoryAreaRepository: IRegulatoryAreaRepository,
) {
    private val logger = LoggerFactory.getLogger(GetAllRegulatoryAreas::class.java)

    fun execute(
        controlPlan: String?,
        searchQuery: String?,
        seaFronts: List<String>?,
        tags: List<Int>?,
        themes: List<Int>?,
        onlyRecentsAreas: Boolean? = false,
    ): AllRegulatoryAreasAndTotal {
        logger.info("Attempt to GET all regulatory areas")

        val allAreas =
            regulatoryAreaRepository.findAll(
                controlPlan = controlPlan,
                query = searchQuery,
                seaFronts = seaFronts,
                tags = tags,
                themes = themes,
                onlyRecentsAreas = onlyRecentsAreas,
            )

        val groups = allAreas.filter { it.areaType == AreaTypeEnum.GROUP }
        val areas = allAreas.filter { it.areaType == AreaTypeEnum.ZONE }

        val groupedAreas =
            groups
                .associateWith { group -> areas.filter { it.layerName == group.layerName } }
                .filterValues { it.isNotEmpty() }

        val totalCount = groupedAreas.flatMap { it.value }.count().toLong()

        logger.info("Found $totalCount regulatory areas across ${groupedAreas.size} layers")

        return Pair(groupedAreas, totalCount)
    }
}

typealias AllRegulatoryAreasAndTotal = Pair<Map<RegulatoryAreaEntity, List<RegulatoryAreaEntity>>, Long>
