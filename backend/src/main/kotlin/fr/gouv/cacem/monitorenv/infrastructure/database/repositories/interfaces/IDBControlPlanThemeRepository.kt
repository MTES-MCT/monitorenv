package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlPlanSubThemeModel
import org.springframework.data.repository.CrudRepository

interface IDBControlPlanThemeRepository : CrudRepository<ControlPlanSubThemeModel, Int> {
    fun findByYearOrderById(year: Int): List<ControlPlanSubThemeModel>
}
