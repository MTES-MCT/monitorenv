SELECT 
    id,
    md5(
        COALESCE(geom::text, '') ||
        COALESCE("name"::text, '') ||
        COALESCE(control_unit_ids::INT[], 0) ||
        COALESCE(amp_ids::INT[], 0) ||
        
  ) AS monitorenv_row_hash
FROM public.localized_areas;