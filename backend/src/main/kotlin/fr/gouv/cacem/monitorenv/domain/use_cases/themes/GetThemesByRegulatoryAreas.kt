package fr.gouv.cacem.monitorenv.domain.use_cases.themes

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IThemeRepository
import org.slf4j.LoggerFactory

@UseCase
class GetThemesByRegulatoryAreas(
    private val themeRepository: IThemeRepository,
) {
    private val logger = LoggerFactory.getLogger(GetThemesByRegulatoryAreas::class.java)

    fun execute(regulationsIds: List<Int>): List<ThemeEntity> {
        logger.info("Attempt to GET all themes from regulations $regulationsIds")
        val themes = themeRepository.findAllWithinByRegulatoryAreaIds(regulationsIds)
        logger.info("Found ${themes.size} themes")

        return themes
    }
}
