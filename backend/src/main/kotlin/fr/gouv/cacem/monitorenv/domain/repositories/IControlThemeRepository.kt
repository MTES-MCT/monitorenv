package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlThemes.ControlThemeEntity

interface IControlThemeRepository {
    fun findControlThemeById(controlThemeId: Int): ControlThemeEntity
    fun findControlThemes(): List<ControlThemeEntity>
}
