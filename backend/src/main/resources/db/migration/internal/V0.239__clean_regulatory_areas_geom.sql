UPDATE regulatory_areas 
  SET geom = ST_Multi(ST_CollectionExtract(ST_MakeValid(geom), 3)) 
  WHERE NOT ST_IsValid(geom) AND area_type='ZONE';