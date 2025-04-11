package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

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
    override fun findAllWithin(time: ZonedDateTime): List<ThemeEntity> =
        dbThemeRepository.findAllWithin(time).map { it.toThemeEntity() }

    @Transactional
    override fun findAllWithinByRegulatoryAreaIds(
        regulatoryAreaIds: List<Int>,
        time: ZonedDateTime,
    ): List<ThemeEntity> =
        dbThemeRepository.findAllWithinByRegulatoryAreaIds(regulatoryAreaIds, time).map {
            it.toThemeEntity()
        }
}
