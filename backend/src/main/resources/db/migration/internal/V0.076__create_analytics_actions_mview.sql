CREATE MATERIALIZED VIEW public.analytics_actions AS

SELECT
    a.id,
    a.mission_id,
    action_start_datetime_utc,
    EXTRACT(year FROM action_start_datetime_utc) AS year,
    m.start_datetime_utc AS mission_start_datetime_utc,
    m.end_datetime_utc AS mission_end_datetime_utc,
    mission_type,
    action_type,
    COALESCE(m.facade, 'Hors façade') AS facade,
    cu.name AS control_unit,
    adm.name AS administration,
    CASE WHEN COALESCE(t1->>'theme', '') = '' THEN 'Aucun thème' ELSE t1->>'theme' END AS theme_level_1,
    CASE WHEN TRIM(BOTH '"' FROM (COALESCE(theme_level_2, 'null')::VARCHAR)) IN ('', 'null') THEN 'Aucun sous-thème' ELSE TRIM(BOTH '"' FROM (theme_level_2::VARCHAR)) END AS theme_level_2,
    CASE WHEN action_type = 'CONTROL' THEN ST_X(geom_element.geom) END AS longitude,
    CASE WHEN action_type = 'CONTROL' THEN ST_Y(geom_element.geom) END AS latitude,
    CASE WHEN action_type = 'CONTROL' THEN CASE WHEN jsonb_array_length(a.value->'infractions') > 0 THEN true ELSE false END END AS infraction,
    (a.value->'actionNumberOfControls')::DOUBLE PRECISION AS number_of_controls,
    CASE WHEN action_type = 'SURVEILLANCE' THEN COALESCE((a.value->>'duration')::DOUBLE PRECISION, EXTRACT(epoch FROM m.end_datetime_utc - m.start_datetime_utc) / 3600) END AS surveillance_duration
FROM env_actions a
LEFT JOIN ST_Dump(a.geom) AS geom_element
ON true
LEFT JOIN LATERAL jsonb_array_elements(a.value->'themes') t1 ON true
LEFT JOIN LATERAL jsonb_array_elements(t1->'subThemes') theme_level_2 ON true
JOIN missions m
ON a.mission_id = m.id
LEFT JOIN LATERAL unnest(mission_types) mission_type ON true
LEFT JOIN missions_control_units mcu
ON mcu.mission_id = m.id
LEFT JOIN control_units cu
ON cu.id = mcu.control_unit_id
LEFT JOIN administrations adm
ON adm.id = cu.administration_id
WHERE
    NOT m.deleted AND
    m.closed AND
    action_type IN ('CONTROL', 'SURVEILLANCE')
ORDER BY action_start_datetime_utc DESC;

CREATE INDEX ON analytics_actions USING BRIN(action_start_datetime_utc);