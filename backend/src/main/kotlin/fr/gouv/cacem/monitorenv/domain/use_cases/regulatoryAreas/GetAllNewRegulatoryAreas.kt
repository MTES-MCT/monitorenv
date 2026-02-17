package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaNewEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaNewRepository
import org.slf4j.LoggerFactory

@UseCase
class GetAllNewRegulatoryAreas(
    private val regulatoryAreaRepository: IRegulatoryAreaNewRepository,
) {
    private val logger = LoggerFactory.getLogger(GetAllRegulatoryAreas::class.java)

    fun execute(
        searchQuery: String?,
        seaFronts: List<String>?,
        tags: List<Int>?,
        themes: List<Int>?,
    ): Map<String?, List<RegulatoryAreaNewEntity>> {
        logger.info("Attempt to GET all regulatory areas")
        val regulatoryAreas =
            regulatoryAreaRepository
                .findAll(
                    query = searchQuery,
                    seaFronts = seaFronts,
                    tags = tags,
                    themes = themes,
                ).groupBy { it.layerName }
        logger.info("Found ${regulatoryAreas.size} regulatory areas")

        return regulatoryAreas
    }
}
