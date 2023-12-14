package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlPlanTheme.ControlPlanThemeEntity

interface IControlPlanThemeRepository {
    fun findByYear(year: Int): List<ControlPlanThemeEntity>
}
