SELECT 
    id,
    md5(
        COALESCE("name"::VARCHAR, '') ||
        COALESCE(parent_id::INT, 0) ||
        COALESCE(started_at::TIMESTAMP, NOW()) ||
        COALESCE(ended_at::TIMESTAMP, NOW()) ||
        COALESCE(control_plan_themes_id::INT, 0) ||
        COALESCE(control_plan_sub_themes_id::INT, 0) ||
        COALESCE(control_plan_tags_id::INT, 0) ||
        COALESCE(reportings_control_plan_sub_themes_id::INT, 0)
  ) AS monitorenv_row_hash
FROM public.themes