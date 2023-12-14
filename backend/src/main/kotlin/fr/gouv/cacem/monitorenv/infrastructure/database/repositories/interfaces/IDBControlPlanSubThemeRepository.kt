package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlPlanSubThemeModel
import org.springframework.data.jpa.repository.JpaRepository

interface IDBControlPlanSubThemeRepository : JpaRepository<ControlPlanSubThemeModel, Int> {
    fun findByYearOrderById(year: Int): List<ControlPlanSubThemeModel>
}
