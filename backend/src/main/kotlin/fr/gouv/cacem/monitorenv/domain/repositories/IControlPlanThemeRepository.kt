package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlPlan.ControlPlanThemeEntity

interface IControlPlanThemeRepository {
    fun findAll(): List<ControlPlanThemeEntity>

    fun findByYear(year: Int): List<ControlPlanThemeEntity>
}
