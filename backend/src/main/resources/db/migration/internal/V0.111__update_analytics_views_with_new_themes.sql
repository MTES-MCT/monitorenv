/* Update analytics_actions views */
DROP MATERIALIZED VIEW analytics_actions;

CREATE MATERIALIZED VIEW public.analytics_actions AS

SELECT
    a.id,
    a.mission_id,
    action_start_datetime_utc,
    action_end_datetime_utc,
    EXTRACT(year FROM action_start_datetime_utc) AS year,
    m.start_datetime_utc AS mission_start_datetime_utc,
    m.end_datetime_utc AS mission_end_datetime_utc,
    mission_type,
    action_type,
    COALESCE(m.facade, 'Hors façade') AS mission_facade,
    cu.name AS control_unit,
    adm.name AS administration,
    cu.name ILIKE 'ulam%' OR (
        adm.name = 'DIRM / DM' AND
        cu.name ILIKE 'PAM%'
    ) AS is_aff_mar,
    (
        cu.name ILIKE 'ulam%' OR (
            adm.name = 'DIRM / DM' AND
            cu.name ILIKE 'PAM%'
        )
    ) OR adm.name IN ('Gendarmerie Nationale', 'Gendarmerie Maritime', 'Douane', 'Marine Nationale') AS is_aem,
    CASE
        WHEN cu.name ILIKE 'ulam%' OR (adm.name = 'DIRM / DM' AND cu.name ILIKE 'PAM%') THEN 'Affaires Maritimes'
        WHEN adm.name IN ('Gendarmerie Nationale', 'Gendarmerie Maritime', 'Douane', 'Marine Nationale') THEN adm.name
        ELSE 'Administrations hors AEM'
    END AS administration_aem,
    COALESCE(a.facade, 'Hors façade') AS action_facade,
    COALESCE(a.department, 'Hors département') AS action_department,
    COALESCE(t3.theme, 'Aucun thème') AS theme_level_1,
    COALESCE(t2.subtheme, 'Aucun sous-thème') AS theme_level_2,
    CASE WHEN action_type = 'CONTROL' THEN ST_X(geom_element.geom) END AS longitude,
    CASE WHEN action_type = 'CONTROL' THEN ST_Y(geom_element.geom) END AS latitude,
    CASE WHEN action_type = 'CONTROL' THEN CASE WHEN jsonb_array_length(a.value->'infractions') > 0 THEN true ELSE false END END AS infraction,
    (a.value->>'actionNumberOfControls')::DOUBLE PRECISION AS number_of_controls,
    CASE WHEN action_type = 'SURVEILLANCE' THEN EXTRACT(epoch FROM a.action_end_datetime_utc - a.action_start_datetime_utc) / 3600.0 END AS surveillance_duration,
    m.observations_cacem
FROM env_actions a
LEFT JOIN ST_Dump(a.geom) AS geom_element
ON true
LEFT JOIN env_actions_control_plan_themes t0 on t0.env_action_id = a.id
LEFT JOIN env_actions_control_plan_sub_themes t1 on t1.env_action_id = a.id
LEFT JOIN control_plan_sub_themes t2 on t2.id = t1.subtheme_id
LEFT JOIN control_plan_themes t3 on t3.id = t0.theme_id
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



/* Update analytics_controls_locations views */
DROP MATERIALIZED VIEW analytics_controls_locations;

CREATE MATERIALIZED VIEW public.analytics_controls_locations AS

SELECT
        a.id as action_id,
        a.action_start_datetime_utc,
        COALESCE(t3.theme, 'Aucun thème') AS theme,
        COALESCE(t2.subtheme, 'Aucun sous-thème') AS subtheme,
        m.facade AS facade,
        St_X((St_Dump(a.geom)).geom) AS lon,
        St_Y((St_Dump(a.geom)).geom) AS lat
FROM missions m
JOIN env_actions AS a ON m.id=a.mission_id
LEFT JOIN env_actions_control_plan_themes t0 on t0.env_action_id = a.id
LEFT JOIN env_actions_control_plan_sub_themes t1 on t1.env_action_id = a.id
LEFT JOIN control_plan_sub_themes t2 on t2.id = t1.subtheme_id
LEFT JOIN control_plan_themes t3 on t3.id = t0.theme_id    
WHERE
    a.action_type='CONTROL';