package fr.gouv.cacem.monitorenv.domain.use_cases.themes

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IThemeRepository
import org.slf4j.LoggerFactory
import java.time.ZonedDateTime

@UseCase
class GetThemes(
    private val themeRepository: IThemeRepository,
) {
    private val logger = LoggerFactory.getLogger(GetThemes::class.java)

    fun execute(
        startedAt: ZonedDateTime,
        endedAt: ZonedDateTime,
    ): List<ThemeEntity> {
        logger.info("Attempt to GET all themes")
        val themes = themeRepository.findAllWithin(startedAt, endedAt)
        logger.info("Found ${themes.size} themes")

        return themes
    }
}
