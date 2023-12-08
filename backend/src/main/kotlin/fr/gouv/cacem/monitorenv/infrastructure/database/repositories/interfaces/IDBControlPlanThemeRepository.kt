package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlPlanThemeModel
import org.springframework.data.jpa.repository.JpaRepository

interface IDBControlPlanThemeRepository : JpaRepository<ControlPlanThemeModel, Int> {
    @Query(
        value = """
        SELECT th.*
        FROM control_plan_themes th, control_plan_sub_themes s
        WHERE th.id = s.theme_id
        AND s.year = :year
        ORDER BY th.id ASC
        """,
        nativeQuery = true,
    )
    fun findByYearOrderById(year: Int): List<ControlPlanThemeModel>
}
