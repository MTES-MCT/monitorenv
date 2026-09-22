package fr.gouv.cacem.monitorenv.domain.use_cases.themes

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IThemeRepository
import org.slf4j.LoggerFactory

@UseCase
class SaveTheme(
    private val themeRepository: IThemeRepository,
) {
    private val logger = LoggerFactory.getLogger(SaveTheme::class.java)

    fun execute(theme: ThemeEntity): ThemeEntity {
        logger.info("Attempt to ${if (theme.id === null) "create a theme" else "update with id ${theme.id}"}")
        val savedTheme = themeRepository.save(theme)
        logger.info("Theme ${savedTheme.id} saved")

        return savedTheme
    }
}
