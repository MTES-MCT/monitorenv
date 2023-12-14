package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlPlan.ControlPlanSubThemeEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlPlanSubThemeRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlPlanSubThemeRepository
import org.springframework.stereotype.Repository

@Repository
class JpaControlPlanSubThemeRepository(
    private val dbControlPlanSubThemeRepository: IDBControlPlanSubThemeRepository,
) : IControlPlanSubThemeRepository {
    override fun findAll(): List<ControlPlanSubThemeEntity> {
        return dbControlPlanSubThemeRepository.findAll().map { it.toControlPlanSubThemeEntity() }
    }
}
