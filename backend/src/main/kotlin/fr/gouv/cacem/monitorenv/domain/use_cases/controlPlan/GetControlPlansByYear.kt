package fr.gouv.cacem.monitorenv.domain.use_cases.controlPlan

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.controlPlan.ControlPlanSubThemeEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlPlan.ControlPlanTagEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlPlan.ControlPlanThemeEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlPlanSubThemeRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IControlPlanTagRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IControlPlanThemeRepository
import org.slf4j.LoggerFactory

@UseCase
class GetControlPlansByYear(
    private val controlPlanThemeRepository: IControlPlanThemeRepository,
    private val controlPlanSubThemeRepository: IControlPlanSubThemeRepository,
    private val controlPlanTagRepository: IControlPlanTagRepository,
) {
    private val logger = LoggerFactory.getLogger(GetControlPlansByYear::class.java)

    fun execute(year: Int): ControlPlanByYear {
        logger.info("Attempt to GET all control plans for year $year")
        val controlPlanThemes = controlPlanThemeRepository.findByYear(year)
        val controlPlanSubThemes = controlPlanSubThemeRepository.findByYear(year)
        val controlPlanTags = controlPlanTagRepository.findByYear(year)
        logger.info(
            "Found ${controlPlanThemes.size} control plan themes, ${controlPlanSubThemes.size} control plan subthemes and ${controlPlanTags.size} control plan tags for year $year",
        )

        return Triple(controlPlanThemes, controlPlanSubThemes, controlPlanTags)
    }
}

typealias ControlPlanByYear =
    Triple<
        List<ControlPlanThemeEntity>,
        List<ControlPlanSubThemeEntity>,
        List<ControlPlanTagEntity>,
        >
