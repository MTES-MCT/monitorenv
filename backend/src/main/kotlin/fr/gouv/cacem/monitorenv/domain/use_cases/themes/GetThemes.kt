package fr.gouv.cacem.monitorenv.domain.use_cases.themes

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IThemeRepository
import org.slf4j.LoggerFactory

@UseCase
class GetThemes(
    private val themeRepository: IThemeRepository,
) {
    private val logger = LoggerFactory.getLogger(GetThemes::class.java)

    fun execute(): List<ThemeEntity> {
        logger.info("Attempt to GET all themes")
        val themes = themeRepository.findAllWithin()
        logger.info("Found ${themes.size} themes")

        return themes
    }
}
