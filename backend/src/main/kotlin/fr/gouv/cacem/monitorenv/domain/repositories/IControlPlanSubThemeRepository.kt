package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.ControlPlanSubTheme.ControlPlanSubThemeEntity

interface IControlPlanSubThemeRepository {
    fun findByYear(year: Int): List<ControlPlanSubThemeEntity>
}
