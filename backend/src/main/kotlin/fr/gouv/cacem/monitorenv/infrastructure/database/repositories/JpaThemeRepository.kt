package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IThemeRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBThemeRepository
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class JpaThemeRepository(
    private val dbThemeRepository: IDBThemeRepository,
) : IThemeRepository {

    @Transactional
    override fun findAll(): List<ThemeEntity> {
        return dbThemeRepository.findAllCurrent().map { it.toThemeEntity() }
    }
}

