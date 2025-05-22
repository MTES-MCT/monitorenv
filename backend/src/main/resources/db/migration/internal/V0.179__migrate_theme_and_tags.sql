-- INSERTING TAGS <-> VIGILANCES AREAS FROM CURRENT VIGILANCES AREAS
INSERT INTO tags_vigilance_areas (tags_id, vigilance_areas_id)
SELECT t.id, va.id
FROM vigilance_areas va
         INNER JOIN tags t ON t.name = ANY (va.themes);

-- INSERTING THEMES <-> ENV ACTION FROM control_plans
INSERT INTO themes_env_actions (env_actions_id, themes_id)
SELECT DISTINCT eacpt.env_action_id, t.id
FROM env_actions_control_plan_themes eacpt
         INNER JOIN control_plan_themes cpt ON eacpt.theme_id = cpt.id
         INNER JOIN themes t ON t.control_plan_themes_id = cpt.id;

INSERT INTO themes_env_actions (env_actions_id, themes_id)
SELECT DISTINCT eacpst.env_action_id, t.id
FROM public.env_actions_control_plan_sub_themes eacpst
         INNER JOIN control_plan_sub_themes cpst ON eacpst.subtheme_id = cpst.id
         INNER JOIN themes t ON t.control_plan_sub_themes_id = cpst.id;

INSERT INTO themes_env_actions (env_actions_id, themes_id)
SELECT DISTINCT eacpt.env_action_id, t.id
FROM public.env_actions_control_plan_tags eacpt
         INNER JOIN control_plan_tags cpt ON eacpt.tag_id = cpt.id
         INNER JOIN themes t ON t.control_plan_tags_id = cpt.id;

INSERT INTO themes_reportings (reportings_id, themes_id)
SELECT DISTINCT reporting.id, reporting.control_plan_theme_id
FROM public.reportings reporting
WHERE reporting.control_plan_theme_id IS NOT NULL;

INSERT INTO themes_reportings (reportings_id, themes_id)
SELECT DISTINCT rcpst.reporting_id, t.id
FROM public.reportings_control_plan_sub_themes rcpst
         INNER JOIN control_plan_sub_themes cpst ON rcpst.subtheme_id = cpst.id
         INNER JOIN themes t ON t.control_plan_sub_themes_id = cpst.id;