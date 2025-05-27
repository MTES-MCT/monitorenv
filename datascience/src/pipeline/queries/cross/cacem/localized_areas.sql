SELECT 
    id,
    "name",
    group_name,
    geom,
    control_unit_ids,
    amp_ids
FROM prod.localized_areas
WHERE geom IS NOT NULL 
    AND "name" IS NOT NULL;