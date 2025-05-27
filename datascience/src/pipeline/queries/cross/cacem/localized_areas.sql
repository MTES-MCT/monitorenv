SELECT 
    id,
    amp_ids,
    control_unit_ids,
    group_name,
    geom,
    "name"
FROM prod.localized_areas
WHERE geom IS NOT NULL 
    AND "name" IS NOT NULL;