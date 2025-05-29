/* Update analytics_controls_locations views */
DROP VIEW analytics_controls_locations;

CREATE VIEW public.analytics_controls_locations AS

SELECT a.id                                        as action_id,
       a.action_start_datetime_utc,
       COALESCE(theme.name, 'Aucun thème')         AS theme,
       COALESCE(subTheme.name, 'Aucun sous-thème') AS subtheme,
       m.facade                                    AS facade,
       St_X((St_Dump(a.geom)).geom)                AS lon,
       St_Y((St_Dump(a.geom)).geom)                AS lat
FROM missions m
         JOIN env_actions AS a ON m.id = a.mission_id
         LEFT JOIN themes_env_actions on env_actions_id = a.id
         LEFT JOIN themes_env_actions subthemes_env_actions on subthemes_env_actions.env_actions_id = a.id
         LEFT JOIN themes subTheme on subTheme.id = subthemes_env_actions.themes_id
         LEFT JOIN themes theme on theme.id = themes_env_actions.themes_id
WHERE a.action_type = 'CONTROL'
  AND (subTheme.id IS NULL OR theme.id IS NULL OR subTheme.parent_id = theme.id)
