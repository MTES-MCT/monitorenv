package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlPlanTagModel
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface IDBControlPlanTagRepository : JpaRepository<ControlPlanTagModel, Int> {
    @Query(
        value = """
        SELECT tags.*
        FROM control_plan_tags tags, control_plan_sub_themes s, control_plan_themes th
        WHERE tags.theme_id = th.id
            AND th.id = s.theme_id
            AND s.year = :year
        ORDER BY tags.id ASC
        """,
        nativeQuery = true,
    )
    fun findByYearOrderById(year: Int): List<ControlPlanTagModel>
}
