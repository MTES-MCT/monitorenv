package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.EnvActionModel
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.util.*

interface IDBEnvActionRepository : JpaRepository<EnvActionModel, UUID> {
    @Query(
        value =
            """
            SELECT
                env_action.id,
                env_action.mission_id,
                env_action.value,
                env_action.action_start_datetime_utc,
                env_action.geom,
                env_action.facade,
                env_action.department,
                ARRAY_AGG(DISTINCT themes.theme_id) AS themes_ids,
                ARRAY_AGG(DISTINCT sub_themes.subtheme_id) AS sub_themes_ids,
                ARRAY_AGG(DISTINCT control_units.id) AS control_units_ids,
                ARRAY_AGG(DISTINCT control_units.administration_id) AS administration_ids
            FROM env_actions env_action
            JOIN env_actions_control_plan_themes themes ON themes.env_action_id = env_action.id
            JOIN env_actions_control_plan_sub_themes sub_themes ON sub_themes.env_action_id = env_action.id
            JOIN missions_control_units ON env_action.mission_id = missions_control_units.mission_id
            JOIN control_units ON missions_control_units.control_unit_id = control_units.id
            WHERE env_action.action_type = 'CONTROL'
            GROUP BY env_action.id;
        """,
        nativeQuery = true,
    )
    fun getRecentControlsActivity(): List<Array<Any>>
}
