package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlThemes.ControlThemeEntity

interface IControlThemeRepository {
    fun findById(controlThemeId: Int): ControlThemeEntity
    fun findAll(): List<ControlThemeEntity>
}
