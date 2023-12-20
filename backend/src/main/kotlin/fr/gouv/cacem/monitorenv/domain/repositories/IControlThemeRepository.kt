package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlTheme.ControlThemeEntity

@Deprecated("Use IControlPlanSubThemeRepository instead")
interface IControlThemeRepository {
    fun findById(controlThemeId: Int): ControlThemeEntity
    fun findAll(): List<ControlThemeEntity>
}
