package fr.gouv.cacem.monitorenv.domain.use_cases.controlPlan

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.controlPlan.ControlPlanSubThemeEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlPlan.ControlPlanTagEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlPlan.ControlPlanThemeEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlPlanSubThemeRepository
import org.slf4j.LoggerFactory

@UseCase
class GetControlPlansByYear(
    private val controlPlanThemeRepository: IControlPlanThemeRepository,
    private val controlPlanSubThemeRepository: IControlPlanSubThemeRepository,
    private val controlPlanTagRepository: IControlPlanTagRepository,
) {
    private val logger = LoggerFactory.getLogger(GetControlPlansByYear::class.java)
    fun execute(year: Int): ControlPlanByYear {
        val controlPlanThemes = getControlPlanThemes(year)
        val controlPlanSubThemes = controlPlanSubThemeRepository.findByYear(year)
        val controlPlanTags = controlPlanSubThemes.map { it.allowedTags }.flatten().toSet()
        logger.info("Found ${controlPlanSubThemes.size} control plan subthemes for year $year")
        return Triple(controlPlanSubThemes, controlPlanTags, controlPlanThemes)
    }
}

typealias ControlPlanByYear = Triple<
    List<ControlPlanThemeEntity>,
    List<ControlPlanSubThemeEntity>,
    List<ControlPlanTagEntity>,>
