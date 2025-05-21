SELECT 
    tags_id,
    regulatory_areas_id
FROM prod.tags_regulatory_areas
INNER JOIN prod."REG_ENV_V3" regulatory_areas ON regulatory_areas_id = regulatory_areas.id
WHERE regulatory_areas.geom IS NOT NULL
  AND regulatory_areas.ent_name IS NOT NULL
  AND regulatory_areas.layer_name IS NOT NULL
ORDER BY tags_id