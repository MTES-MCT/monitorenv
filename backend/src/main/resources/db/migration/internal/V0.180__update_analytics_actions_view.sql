/* Update analytics_actions views */
DROP MATERIALIZED VIEW analytics_actions;

CREATE MATERIALIZED VIEW public.analytics_actions AS

SELECT a.id,
       a.mission_id,
       action_start_datetime_utc,
       action_end_datetime_utc,
       EXTRACT(year FROM action_start_datetime_utc)                                                         AS year,
       m.start_datetime_utc                                                                                 AS mission_start_datetime_utc,
       m.end_datetime_utc                                                                                   AS mission_end_datetime_utc,
       m.created_at_utc                                                                                     AS mission_created_at_utc,
       m.updated_at_utc                                                                                     AS mission_updated_at_utc,
       mission_type,
       action_type,
       COALESCE(m.facade, 'Hors façade')                                                                    AS mission_facade,
       cu.id                                                                                                AS control_unit_id,
       cu.name                                                                                              AS control_unit,
       adm.name                                                                                             AS administration,
       cu.name ILIKE 'ulam%' OR (
           adm.name = 'DIRM / DM' AND
           cu.name ILIKE 'PAM%'
           )                                                                                                AS is_aff_mar,
       (
           cu.name ILIKE 'ulam%' OR (
               adm.name = 'DIRM / DM' AND
               cu.name ILIKE 'PAM%'
               )
           ) OR adm.name IN ('Gendarmerie Nationale', 'Gendarmerie Maritime', 'Douane', 'Marine Nationale') AS is_aem,
       CASE
           WHEN cu.name ILIKE 'ulam%' OR (adm.name = 'DIRM / DM' AND cu.name ILIKE 'PAM%') THEN 'Affaires Maritimes'
           WHEN adm.name IN ('Gendarmerie Nationale', 'Gendarmerie Maritime', 'Douane', 'Marine Nationale')
               THEN adm.name
           ELSE 'Administrations hors AEM'
           END                                                                                              AS administration_aem,
       COALESCE(a.facade, 'Hors façade')                                                                    AS action_facade,
       COALESCE(a.department, 'Hors département')                                                           AS action_department,
       CASE COALESCE(theme.name, 'Aucun thème')
           WHEN 'Activités et manifestations soumises à évaluation d’incidence Natura 2000' THEN 'EIN2000'
           ELSE COALESCE(theme.name, 'Aucun thème')
           END                                                                                              AS theme_level_1,
       COALESCE(subTheme.name, 'Aucun sous-thème')                                                          AS theme_level_2,
       CASE
           WHEN theme.name LIKE '%êche%' THEN 'PIRC'
           ELSE 'PSCEM'
           END                                                                                              AS plan,
       CASE WHEN action_type = 'CONTROL' THEN ST_X(geom_element.geom) END                                   AS longitude,
       CASE WHEN action_type = 'CONTROL' THEN ST_Y(geom_element.geom) END                                   AS latitude,
       CASE
           WHEN action_type = 'CONTROL' THEN CASE
                                                 WHEN jsonb_array_length(a.value -> 'infractions') > 0 THEN true
                                                 ELSE false END END                                         AS infraction,
       (a.value ->> 'actionNumberOfControls')::DOUBLE PRECISION                                             AS number_of_controls,
       (a.value -> 'awareness' ->> 'nbPerson')::DOUBLE PRECISION                                            AS number_of_awareness,
       CASE
           WHEN action_type = 'SURVEILLANCE' THEN
               EXTRACT(epoch FROM a.action_end_datetime_utc - a.action_start_datetime_utc) /
               3600.0 END                                                                                   AS surveillance_duration,
       m.observations_cacem
FROM env_actions a
         LEFT JOIN ST_Dump(a.geom) AS geom_element
                   ON true
         LEFT JOIN themes_env_actions on env_actions_id = a.id
         LEFT JOIN themes_env_actions subthemes_env_actions on subthemes_env_actions.env_actions_id = a.id
         LEFT JOIN themes subTheme on subTheme.id = subthemes_env_actions.themes_id
         LEFT JOIN themes theme on theme.id = themes_env_actions.themes_id
         JOIN missions m
              ON a.mission_id = m.id
         LEFT JOIN LATERAL unnest(mission_types) mission_type ON true
         LEFT JOIN missions_control_units mcu
                   ON mcu.mission_id = m.id
         LEFT JOIN control_units cu
                   ON cu.id = mcu.control_unit_id
         LEFT JOIN administrations adm
                   ON adm.id = cu.administration_id
WHERE NOT m.deleted
  AND completion = 'COMPLETED'
  AND action_type IN ('CONTROL', 'SURVEILLANCE')
  AND (subTheme.id IS NULL OR theme.id IS NULL OR subTheme.parent_id = theme.id)
  AND cu.id IS NOT NULL
ORDER BY action_start_datetime_utc DESC;

CREATE INDEX ON analytics_actions USING BRIN (action_start_datetime_utc);
