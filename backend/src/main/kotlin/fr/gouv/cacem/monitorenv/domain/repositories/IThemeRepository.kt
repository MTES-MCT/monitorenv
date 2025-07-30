package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionControlPlanEntity
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import java.time.ZonedDateTime

interface IThemeRepository {
    fun findAllWithin(
        startedAt: ZonedDateTime,
        endedAt: ZonedDateTime,
    ): List<ThemeEntity>

    fun findAllWithinByRegulatoryAreaIds(
        regulatoryAreaIds: List<Int>,
        time: ZonedDateTime = ZonedDateTime.now(),
    ): List<ThemeEntity>

    fun findAllWithinByVigilanceAreasIds(
        vigilanceAreasIds: List<Int>,
        time: ZonedDateTime = ZonedDateTime.now(),
    ): List<ThemeEntity>

    fun findEnvActionControlPlanByIds(ids: List<Int>): EnvActionControlPlanEntity

    fun findAllById(ids: List<Int>): List<ThemeEntity>
}
