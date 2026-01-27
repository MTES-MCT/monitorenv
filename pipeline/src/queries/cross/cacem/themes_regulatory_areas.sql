SELECT 
    themes_id,
    regulatory_areas_id
FROM prod.themes_regulatory_areas
INNER JOIN prod."REG_ENV_V3" regulatory_areas ON regulatory_areas_id = regulatory_areas.id
WHERE regulatory_areas.geom IS NOT NULL
  AND regulatory_areas.resume IS NOT NULL
  AND regulatory_areas.layer_name IS NOT NULL
ORDER BY themes_id