package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import java.time.ZonedDateTime

interface IThemeRepository {
    fun findAllWithin(time: ZonedDateTime = ZonedDateTime.now()): List<ThemeEntity>

    fun findAllWithinByRegulatoryAreaIds(
        regulatoryAreaIds: List<Int>,
        time: ZonedDateTime = ZonedDateTime.now(),
    ): List<ThemeEntity>
}
