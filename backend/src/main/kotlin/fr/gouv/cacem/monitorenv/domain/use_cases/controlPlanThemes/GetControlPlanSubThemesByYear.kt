package fr.gouv.cacem.monitorenv.domain.use_cases.ControlPlanSubThemes

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.ControlPlanSubTheme.ControlPlanSubThemeEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlPlanSubThemeRepository
import org.slf4j.LoggerFactory

@UseCase
class GetControlPlanSubThemesByYear(private val ControlPlanSubThemeRepository: IControlPlanSubThemeRepository) {
    private val logger = LoggerFactory.getLogger(GetControlPlanSubThemesByYear::class.java)
    fun execute(year: Int): List<ControlPlanSubThemeEntity> {
        val ControlPlanSubThemes = ControlPlanSubThemeRepository.findByYear(year)
        logger.info("Found ${ControlPlanSubThemes.size} control plan (sub)themes for year $year")
        return ControlPlanSubThemes
    }
}
