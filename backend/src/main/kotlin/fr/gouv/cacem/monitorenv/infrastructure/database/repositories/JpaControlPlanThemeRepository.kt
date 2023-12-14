package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlPlanTheme.ControlPlanThemeEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlPlanThemeRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlPlanThemeRepository
import org.springframework.stereotype.Repository

@Repository
class JpaControlPlanThemeRepository(
    private val dbControlPlanThemeRepository: IDBControlPlanThemeRepository,
) : IControlPlanThemeRepository {
    override fun findByYear(year: Int): List<ControlPlanThemeEntity> {
        return dbControlPlanThemeRepository.findByYearOrderById(year).map { it.toControlPlanTheme() }
    }
}
