package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlPlan.ControlPlanTagEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlPlanTagRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlPlanTagRepository
import org.springframework.stereotype.Repository

@Repository
class JpaControlPlanTagRepository(
    private val dbControlPlanTagRepository: IDBControlPlanTagRepository,
) : IControlPlanTagRepository {
    override fun findAll(): List<ControlPlanTagEntity> =
        dbControlPlanTagRepository.findAll().map {
            it.toControlPlanTagEntity()
        }

    override fun findByYear(year: Int): List<ControlPlanTagEntity> =
        dbControlPlanTagRepository.findByYearOrderById(year).map {
            it.toControlPlanTagEntity()
        }
}
