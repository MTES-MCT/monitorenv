package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaRepository
import org.slf4j.LoggerFactory

@UseCase
class GetAllRegulatoryAreasTiles(
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
        x: Int,
        y: Int,
        z: Int,
    ): ByteArray {
        logger.info("Attempt to GET all regulatory areas")

        return regulatoryAreaRepository.findAllTiles(
            controlPlan = controlPlan,
            query = searchQuery,
            seaFronts = seaFronts,
            tags = tags,
            themes = themes,
            onlyRecentsAreas = onlyRecentsAreas,
            x = x,
            y = y,
            z = z,
        )
    }
}
