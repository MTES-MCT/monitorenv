package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlPlan.ControlPlanThemeEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlPlanThemeRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlPlanThemeRepository
import org.springframework.stereotype.Repository

@Repository
class JpaControlPlanThemeRepository(
    private val dbControlPlanThemeRepository: IDBControlPlanThemeRepository,
) : IControlPlanThemeRepository {
    override fun findAll(): List<ControlPlanThemeEntity> =
        dbControlPlanThemeRepository.findAll().map {
            it.toControlPlanThemeEntity()
        }

    override fun findByYear(year: Int): List<ControlPlanThemeEntity> =
        dbControlPlanThemeRepository.findByYearOrderById(year).map {
            it.toControlPlanThemeEntity()
        }
}
