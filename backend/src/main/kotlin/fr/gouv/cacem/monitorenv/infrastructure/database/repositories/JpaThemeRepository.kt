package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionControlPlanEntity
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IThemeRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBThemeRepository
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.ZonedDateTime

@Repository
class JpaThemeRepository(
    private val dbThemeRepository: IDBThemeRepository,
) : IThemeRepository {
    @Transactional
    override fun findAllWithin(
        startedAt: ZonedDateTime,
        endedAt: ZonedDateTime,
    ): List<ThemeEntity> = dbThemeRepository.findAllWithin(startedAt, endedAt).map { it.toThemeEntity() }

    @Transactional
    override fun findAllWithinByRegulatoryAreaIds(
        regulatoryAreaIds: List<Int>,
        time: ZonedDateTime,
    ): List<ThemeEntity> =
        dbThemeRepository.findAllWithinByRegulatoryAreaIds(regulatoryAreaIds, time).map {
            it.toThemeEntity()
        }

    override fun findEnvActionControlPlanByIds(ids: List<Int>): EnvActionControlPlanEntity {
        val result = dbThemeRepository.findAllControlPlanThemeIdsByIds(ids)
        val controlPlans = result[0] as? Array<Any>
        val themeIds = (controlPlans?.get(0) ?: emptyList<Int>()) as? Array<Int>
        val themeId = if (themeIds?.isNotEmpty() == true) themeIds.first() else null

        return EnvActionControlPlanEntity(
            themeId = themeId,
            subThemeIds = ((controlPlans?.get(1) ?: emptyList<Int>()) as? Array<Int>)?.asList(),
            tagIds = ((controlPlans?.get(2) ?: emptyList<Int>()) as? Array<Int>)?.asList(),
        )
    }
}
