DELETE FROM themes_env_actions;
DELETE FROM themes_regulatory_areas;
DELETE FROM themes;
DELETE FROM tags_regulatory_areas;
DELETE FROM tags;

INSERT INTO themes (id, name, started_at, ended_at, control_plan_themes_id)
SELECT DISTINCT id, theme, '2023-01-01 00:00:00'::timestamp, '2099-12-31 23:59:59'::timestamp, id
FROM control_plan_themes;

select setval('themes_id_seq', (SELECT MAX(id) FROM themes));

INSERT INTO themes (name, parent_id, started_at, ended_at, control_plan_sub_themes_id)
SELECT DISTINCT subtheme, theme_id, '2023-01-01 00:00:00'::timestamp, '2023-12-31 23:59:59'::timestamp, id
FROM control_plan_sub_themes
where year = 2023 ORDER BY ID;

INSERT INTO themes (name, parent_id, started_at, ended_at, control_plan_sub_themes_id)
SELECT DISTINCT subtheme, theme_id, '2024-01-01 00:00:00'::timestamp, '2024-12-31 23:59:59'::timestamp, id
FROM control_plan_sub_themes
where year = 2024 ORDER BY ID;

INSERT INTO themes (name, parent_id, started_at, ended_at, control_plan_sub_themes_id)
SELECT DISTINCT subtheme, theme_id, '2025-01-01 00:00:00'::timestamp, '2025-12-31 23:59:59'::timestamp, id
FROM control_plan_sub_themes
where year = 2025 ORDER BY ID;

INSERT INTO themes (name, parent_id, started_at, ended_at, control_plan_tags_id)
SELECT DISTINCT tag, theme_id, '2023-01-01 00:00:00'::timestamp, '2099-12-31 23:59:59'::timestamp, id
FROM control_plan_tags ORDER BY ID;