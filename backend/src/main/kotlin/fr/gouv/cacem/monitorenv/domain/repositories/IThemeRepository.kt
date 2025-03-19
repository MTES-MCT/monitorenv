package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity

interface IThemeRepository {
    fun findAll(): List<ThemeEntity>
}
