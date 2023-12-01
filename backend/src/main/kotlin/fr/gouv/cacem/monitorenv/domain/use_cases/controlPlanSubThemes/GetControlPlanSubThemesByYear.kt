package fr.gouv.cacem.monitorenv.domain.use_cases.controlPlanSubThemes

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.controlPlanSubTheme.ControlPlanSubThemeEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlPlanSubThemeRepository
import org.slf4j.LoggerFactory

@UseCase
class GetControlPlanSubThemesByYear(private val controlPlanSubThemeRepository: IControlPlanSubThemeRepository) {
    private val logger = LoggerFactory.getLogger(GetControlPlanSubThemesByYear::class.java)
    fun execute(year: Int): List<ControlPlanSubThemeEntity> {
        val controlPlanSubThemes = controlPlanSubThemeRepository.findByYear(year)
        logger.info("Found ${controlPlanSubThemes.size} control plan (sub)themes for year $year")
        return controlPlanSubThemes
    }
}
