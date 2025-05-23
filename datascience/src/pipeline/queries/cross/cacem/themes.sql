SELECT 
    id,
    "name",
    parent_id,
    started_at,
    ended_at,
    control_plan_themes_id,           
    control_plan_sub_themes_id,           
    control_plan_tags_id,                 
    reportings_control_plan_sub_themes_id
FROM prod.themes
WHERE id IN :ids