INSERT INTO themes (id, name, started_at, ended_at, control_plan_themes_id)
SELECT DISTINCT id, theme, '2023-01-01 00:00:00'::timestamp, '2099-12-31 23:59:59'::timestamp, id
FROM control_plan_themes;

select setval('themes_id_seq', (SELECT MAX(id) FROM themes));

INSERT INTO themes_env_actions (env_actions_id, themes_id)
SELECT DISTINCT eacpt.env_action_id, t.id
FROM env_actions_control_plan_themes eacpt
         INNER JOIN control_plan_themes cpt ON eacpt.theme_id = cpt.id
         INNER JOIN themes t ON t.control_plan_themes_id = cpt.id;

INSERT INTO themes (name, parent_id, started_at, ended_at, control_plan_sub_themes_id)
SELECT DISTINCT subtheme, theme_id, '2023-01-01 00:00:00'::timestamp, '2023-12-31 23:59:59'::timestamp, id
FROM control_plan_sub_themes
where year = 2023;

INSERT INTO themes (name, parent_id, started_at, ended_at, control_plan_sub_themes_id)
SELECT DISTINCT subtheme, theme_id, '2024-01-01 00:00:00'::timestamp, '2024-12-31 23:59:59'::timestamp, id
FROM control_plan_sub_themes
where year = 2024;

INSERT INTO themes (name, parent_id, started_at, ended_at, control_plan_sub_themes_id)
SELECT DISTINCT subtheme, theme_id, '2025-01-01 00:00:00'::timestamp, '2025-12-31 23:59:59'::timestamp, id
FROM control_plan_sub_themes
where year = 2025;

INSERT INTO themes_env_actions (env_actions_id, themes_id)
SELECT DISTINCT eacpst.env_action_id, t.id
FROM public.env_actions_control_plan_sub_themes eacpst
         INNER JOIN control_plan_sub_themes cpst ON eacpst.subtheme_id = cpst.id
         INNER JOIN themes t ON t.control_plan_sub_themes_id = cpst.id;

INSERT INTO themes (name, parent_id, started_at, ended_at, control_plan_tags_id)
SELECT DISTINCT tag, theme_id, '2023-01-01 00:00:00'::timestamp, '2099-12-31 23:59:59'::timestamp, id
FROM control_plan_tags;

INSERT INTO themes_env_actions (env_actions_id, themes_id)
SELECT DISTINCT eacpt.env_action_id, t.id
FROM public.env_actions_control_plan_tags eacpt
         INNER JOIN control_plan_tags cpt ON eacpt.tag_id = cpt.id
         INNER JOIN themes t ON t.control_plan_tags_id = cpt.id;

INSERT INTO themes_reportings (reportings_id, themes_id)
SELECT DISTINCT reporting.id, reporting.control_plan_theme_id
FROM public.reportings reporting;

INSERT INTO themes_reportings (reportings_id, themes_id)
SELECT DISTINCT rcpst.reporting_id, t.id
FROM public.reportings_control_plan_sub_themes rcpst
         INNER JOIN control_plan_sub_themes cpst ON rcpst.subtheme_id = cpst.id
         INNER JOIN themes t ON t.control_plan_sub_themes_id = cpst.id;

INSERT INTO themes_vigilance_areas (vigilance_areas_id, themes_id)
VALUES (2, 108),
       (2, 341);
