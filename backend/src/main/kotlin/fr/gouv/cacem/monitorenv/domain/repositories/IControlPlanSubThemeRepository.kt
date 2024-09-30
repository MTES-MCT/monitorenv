package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlPlan.ControlPlanSubThemeEntity

interface IControlPlanSubThemeRepository {
    fun findAll(): List<ControlPlanSubThemeEntity>

    fun findByYear(year: Int): List<ControlPlanSubThemeEntity>
}
