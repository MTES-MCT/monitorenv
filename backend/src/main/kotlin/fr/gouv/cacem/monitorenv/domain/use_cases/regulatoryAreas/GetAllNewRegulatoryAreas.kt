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
        groupBy: String?,
        searchQuery: String?,
        seaFronts: List<String>?,
    ): Map<String?, List<RegulatoryAreaNewEntity>> {
        logger.info("Attempt to GET all regulatory areas: $groupBy, $searchQuery, $seaFronts")
        val regulatoryAreas =
            regulatoryAreaRepository
                .findAll(
                    groupBy = groupBy,
                    query = searchQuery,
                    seaFronts = seaFronts,
                ).groupBy { it.layerName }
        logger.info("Found ${regulatoryAreas.size} regulatory areas")

        return regulatoryAreas
    }
}
