WITH actions_to_export AS (
    SELECT DISTINCT ON (id, control_unit_id)
        id,
        action_start_datetime_utc,
        action_end_datetime_utc,
        mission_type,
        action_type,
        control_unit_id,
        action_facade,
        action_department,
        infraction,
        number_of_controls,
        surveillance_duration,
        CASE
            WHEN action_type = 'SURVEILLANCE' AND action_end_datetime_utc < :min_datetime_utc THEN true
            WHEN action_type = 'CONTROL' AND action_start_datetime_utc < :min_datetime_utc THEN true
            ELSE false
        END AS is_late_update
    FROM analytics_actions
    WHERE (
            action_type = 'SURVEILLANCE'
            AND (
                    (
                    action_end_datetime_utc >= :min_datetime_utc AND 
                    action_end_datetime_utc < :max_datetime_utc
                    ) OR (
                        action_end_datetime_utc < :min_datetime_utc AND
                        mission_updated_at_utc >= :min_datetime_utc AND
                        mission_updated_at_utc < :max_datetime_utc 
                    )
            )
        ) OR (
            action_type = 'CONTROL'
            AND (
                    (
                    action_start_datetime_utc >= :min_datetime_utc AND 
                    action_start_datetime_utc < :max_datetime_utc
                    ) OR (
                        action_start_datetime_utc < :min_datetime_utc AND
                        mission_updated_at_utc >= :min_datetime_utc AND
                        mission_updated_at_utc < :max_datetime_utc 
                    )
            )
        )
),

-- Controls may have more than one position so we take the average
controls_average_positions AS (
    SELECT
        id,
        AVG(latitude) AS latitude,
        AVG(longitude) AS longitude
    FROM analytics_actions
    WHERE
        action_type = 'CONTROL'
        AND id IN (SELECT id FROM actions_to_export)
        AND latitude IS NOT NULL
        AND longitude IS NOT NULL
    GROUP BY id
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
        jsonb_build_object(
            'theme_level_1',
            theme_level_1,
            'themes_level_2',
            jsonb_agg(theme_level_2) OVER (PARTITION BY id, theme_level_1)) AS theme
    FROM actions_unique_themes_and_subthemes
),

action_themes_and_subthemes AS (
    SELECT
        id,
        jsonb_object_agg(theme->>'theme_level_1', theme->'themes_level_2') AS themes
    FROM action_themes
    GROUP BY id
)

SELECT a.*, t.themes, p.longitude, p.latitude
FROM actions_to_export a
LEFT JOIN action_themes_and_subthemes t
ON a.id = t.id
LEFT JOIN controls_average_positions p
ON a.id = p.id