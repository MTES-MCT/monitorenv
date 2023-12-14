package fr.gouv.cacem.monitorenv.domain.use_cases.controlPlanThemes

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.controlPlanTheme.ControlPlanThemeEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlPlanThemeRepository
import org.slf4j.LoggerFactory

@UseCase
class GetControlPlanThemesByYear(private val controlPlanThemeRepository: IControlPlanThemeRepository) {
    private val logger = LoggerFactory.getLogger(GetControlPlanThemesByYear::class.java)
    fun execute(year: Int): List<ControlPlanThemeEntity> {
        val controlPlanThemes = controlPlanThemeRepository.findByYear(year)
        logger.info("Found ${controlPlanThemes.size} control plan (sub)themes for year $year")
        return controlPlanThemes
    }
}
