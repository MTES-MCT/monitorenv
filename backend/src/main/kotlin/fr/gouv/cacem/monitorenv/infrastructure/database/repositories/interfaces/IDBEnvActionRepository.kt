package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.EnvActionModel
import org.locationtech.jts.geom.Geometry
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
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
                COALESCE(ARRAY_AGG(DISTINCT themes_env_action.themes_id) FILTER (WHERE themes_env_action.themes_id IS NOT NULL), '{}') AS themes_ids,
                COALESCE(ARRAY_AGG(DISTINCT subThemes_env_action.themes_id) FILTER (WHERE subThemes_env_action.themes_id IS NOT NULL), '{}') AS sub_themes_ids,
                COALESCE(ARRAY_AGG(DISTINCT control_units.id), '{}') AS control_units_ids,
                COALESCE(ARRAY_AGG(DISTINCT control_units.administration_id), '{}') AS administration_ids
            FROM env_actions env_action
            LEFT JOIN themes_env_actions themes_env_action ON themes_env_action.env_actions_id = env_action.id
                LEFT JOIN themes ON themes_env_action.themes_id = themes.id AND themes.parent_id IS NULL
            LEFT JOIN themes_env_actions subThemes_env_action ON subThemes_env_action.env_actions_id = env_action.id
                LEFT JOIN themes subThemes ON subThemes_env_action.themes_id = subThemes.id AND subThemes.parent_id IS NOT NULL
            LEFT JOIN missions_control_units ON env_action.mission_id = missions_control_units.mission_id
            LEFT JOIN control_units ON missions_control_units.control_unit_id = control_units.id
            WHERE env_action.action_type = 'CONTROL'
            AND env_action.geom IS NOT NULL
            AND env_action.action_start_datetime_utc IS NOT NULL
            AND (env_action.action_start_datetime_utc >= :startedAfter)
            AND (env_action.action_start_datetime_utc <= :startedBefore)
            AND (
                (:controlUnitIds) IS NULL
                OR control_units.id IN (:controlUnitIds)
            )
            AND (
                (:administrationIds) IS NULL
                OR control_units.administration_id IN (:administrationIds)
            )
            AND (
                (:themeIds) IS NULL
                OR themes_env_action.themes_id IN (:themeIds)
                OR subThemes_env_action.themes_id IN (:themeIds)
            )
            AND (
                CAST(:geometry AS geometry) IS NULL
                OR ST_INTERSECTS(ST_SETSRID(CAST(env_action.geom AS geometry), 4326), ST_SETSRID(CAST(:geometry AS geometry), 4326))
            )
            GROUP BY env_action.id, env_action.action_start_datetime_utc
            ORDER BY env_action.action_start_datetime_utc DESC;
        """,
        nativeQuery = true,
    )
    fun getRecentControlsActivity(
        administrationIds: List<Int>,
        controlUnitIds: List<Int>,
        geometry: Geometry?,
        themeIds: List<Int>,
        startedAfter: Instant,
        startedBefore: Instant,
    ): List<Array<Any>>

    @Modifying
    @Query(
        value = """
        DELETE FROM env_actions WHERE mission_id=:missionId AND id NOT IN (:ids)
    """,
        nativeQuery = true,
    )
    fun deleteAllByIdNotInAndMissionId(
        ids: List<UUID>,
        missionId: Int,
    )

    fun findAllByMissionId(missionId: Int): List<EnvActionModel>
}
