package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlThemes.ControlThemeEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlThemeRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlThemeRepository
import org.springframework.stereotype.Repository

@Repository
class JpaControlThemeRepository(private val dbControlThemeRepository: IDBControlThemeRepository) :
    IControlThemeRepository {

    override fun findAll(): List<ControlThemeEntity> {
        return dbControlThemeRepository.findAll().map { it.toControlTheme() }
    }

    override fun findById(controlThemeId: Int): ControlThemeEntity {
        return dbControlThemeRepository.findById(controlThemeId).get().toControlTheme()
    }
}
