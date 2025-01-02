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
class GetControlPlans(
    private val controlPlanThemeRepository: IControlPlanThemeRepository,
    private val controlPlanSubThemeRepository: IControlPlanSubThemeRepository,
    private val controlPlanTagRepository: IControlPlanTagRepository,
) {
    private val logger = LoggerFactory.getLogger(GetControlPlans::class.java)

    fun execute(): ControlPlanThemes {
        logger.info("Attempt to GET all control plans")
        val controlPlanThemes = controlPlanThemeRepository.findAll()
        val controlPlanSubThemes = controlPlanSubThemeRepository.findAll()
        val controlPlanTags = controlPlanTagRepository.findAll()
        logger.info(
            "Found ${controlPlanThemes.size} control plan themes, ${controlPlanSubThemes.size} control plan subthemes and ${controlPlanTags.size} control plan tags",
        )

        return Triple(controlPlanThemes, controlPlanSubThemes, controlPlanTags)
    }
}

typealias ControlPlanThemes = Triple<
    List<ControlPlanThemeEntity>,
    List<ControlPlanSubThemeEntity>,
    List<ControlPlanTagEntity>,
    >
