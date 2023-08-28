package fr.gouv.cacem.monitorenv.domain.use_cases.controlThemes // ktlint-disable package-name

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.controlThemes.ControlThemeEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlThemeRepository
import org.slf4j.LoggerFactory

@UseCase
class GetAllControlThemes(private val controlThemeRepository: IControlThemeRepository) {
    private val logger = LoggerFactory.getLogger(GetAllControlThemes::class.java)

    fun execute(): List<ControlThemeEntity> {
        val controlThemes = controlThemeRepository.findAll()
        logger.info("Found ${controlThemes.size} control themes ")

        return controlThemes
    }
}
