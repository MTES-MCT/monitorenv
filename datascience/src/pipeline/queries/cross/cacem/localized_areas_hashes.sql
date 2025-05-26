SELECT 
    id,
    "name",
    geom,
    control_unit_ids,
    amp_ids,
    md5(
        COALESCE(geom::text, '') ||
        COALESCE("name"::text, '') ||
        COALESCE(control_unit_ids::INT[], 0) ||
        COALESCE(amp_ids::INT[], 0) ||
        
  ) AS cacem_row_hash
FROM prod.localized_areas
WHERE 
  geom IS NOT NULL
  AND "name" IS NOT NULL;