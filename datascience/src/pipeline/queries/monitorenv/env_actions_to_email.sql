WITH actions_to_export AS (
    SELECT DISTINCT ON (id, control_unit_id)
        id,
        mission_id,
        action_start_datetime_utc,
        action_end_datetime_utc,
        mission_start_datetime_utc,
        mission_end_datetime_utc,
        mission_type,
        action_type,
        mission_facade,
        control_unit_id,
        control_unit,
        administration,
        action_facade,
        action_department,
        longitude,
        latitude,
        infraction,
        number_of_controls,
        surveillance_duration,
        observations_cacem
    FROM analytics_actions
    WHERE (
            action_type = 'SURVEILLANCE'
            AND action_end_datetime_utc >= :min_datetime_utc
            AND action_end_datetime_utc < :max_datetime_utc
        ) OR (
            action_type = 'CONTROL'
            AND action_start_datetime_utc >= :min_datetime_utc
            AND action_start_datetime_utc < :max_datetime_utc
        )
),

actions_unique_themes_and_subthemes AS (
    SELECT DISTINCT 
        id,
        theme_level_1,
        theme_level_2
    FROM analytics_actions
    WHERE id IN (SELECT id FROM actions_to_export)
),

action_themes AS (
    SELECT DISTINCT
        id,
        jsonb_build_object(theme_level_1, jsonb_agg(theme_level_2) OVER (PARTITION BY id, theme_level_1)) AS theme
    FROM actions_unique_themes_and_subthemes
),

action_themes_and_subthemes AS (
    SELECT
        id,
        jsonb_agg(theme) AS themes
    FROM action_themes
    GROUP BY id
)

SELECT a.*, t.themes
FROM actions_to_export a
LEFT JOIN action_themes_and_subthemes t
ON a.id = t.id