package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.EnvActionModel
import org.locationtech.jts.geom.Geometry
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.time.Instant
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
                   COALESCE(ARRAY_AGG(DISTINCT themes.theme_id), '{}') AS themes_ids,
                    COALESCE(ARRAY_AGG(DISTINCT sub_themes.subtheme_id), '{}') AS sub_themes_ids,
                    COALESCE(ARRAY_AGG(DISTINCT control_units.id), '{}') AS control_units_ids,
                    COALESCE(ARRAY_AGG(DISTINCT control_units.administration_id), '{}') AS administration_ids
            FROM env_actions env_action
            LEFT JOIN env_actions_control_plan_themes themes ON themes.env_action_id = env_action.id
            LEFT JOIN env_actions_control_plan_sub_themes sub_themes ON sub_themes.env_action_id = env_action.id
            LEFT JOIN missions_control_units ON env_action.mission_id = missions_control_units.mission_id
            LEFT JOIN control_units ON missions_control_units.control_unit_id = control_units.id
            WHERE env_action.action_type = 'CONTROL'
            AND (env_action.action_start_datetime_utc >= :startedAfter)
            AND (env_action.action_start_datetime_utc <= :startedBefore)
            AND (COALESCE(:controlUnitIds, NULL) IS NULL OR control_units.id IN (:controlUnitIds))
            AND (COALESCE(:administrationIds, NULL) IS NULL OR control_units.administration_id IN (:administrationIds))
            AND (COALESCE(:themeIds, NULL) IS NULL OR themes.theme_id IN (:themeIds))
            AND (CAST(:geometry AS geometry) IS NULL OR ST_INTERSECTS(st_setsrid(CAST(env_action.geom AS geometry), 4326), st_setsrid(CAST(:geometry AS geometry), 4326)))
            GROUP BY env_action.id
            ORDER BY env_action.action_start_datetime_utc DESC;
        """,
        nativeQuery = true,
    )
    fun getRecentControlsActivity(
        administrationIds: List<Int>?,
        controlUnitIds: List<Int>?,
        geometry: Geometry?,
        themeIds: List<Int>?,
        startedAfter: Instant,
        startedBefore: Instant,
    ): List<Array<Any>>
}
