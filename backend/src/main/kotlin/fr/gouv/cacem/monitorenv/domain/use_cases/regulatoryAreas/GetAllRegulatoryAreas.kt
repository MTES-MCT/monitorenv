package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaGroupRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.dtos.RegulatoryAreaGroupDTO
import org.slf4j.LoggerFactory

@UseCase
class GetAllRegulatoryAreas(
    private val regulatoryAreaGroupRepository: IRegulatoryAreaGroupRepository,
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

        val allGroups =
            regulatoryAreaGroupRepository.findAll(
                controlPlan = controlPlan,
                query = searchQuery,
                seaFronts = seaFronts,
                tags = tags,
                themes = themes,
                onlyRecentsAreas = onlyRecentsAreas,
            )

        val totalCount = allGroups.flatMap { it.areas }.count().toLong()

        logger.info("Found $totalCount regulatory areas across ${allGroups.size} layers")

        return Pair(allGroups, totalCount)
    }
}

typealias AllRegulatoryAreasAndTotal = Pair<List<RegulatoryAreaGroupDTO>, Long>
