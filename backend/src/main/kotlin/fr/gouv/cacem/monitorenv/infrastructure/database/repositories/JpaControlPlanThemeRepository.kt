package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlPlanTheme.ControlPlanThemeEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlPlanThemeRepository
import org.springframework.stereotype.Repository

@Repository
class JpaControlPlanThemeRepository() : IControlPlanThemeRepository {
    override fun findByYear(year: Int): List<ControlPlanThemeEntity> {
        return listOf()
    }
}
