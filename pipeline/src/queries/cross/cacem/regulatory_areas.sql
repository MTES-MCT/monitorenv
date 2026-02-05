SELECT 
  id,
  st_multi(ST_SimplifyPreserveTopology(ST_CurveToLine(geom), 0.00001)) geom,
  url,        
  layer_name,
  facade,
  ref_reg,
  editeur,
  source,
  obs,
  thematique,
  validite,
  tempo,
  type,
  date,
  date_fin,
  edition,
  resume,
  poly_name,
  plan
FROM prod.reg_cacem
WHERE 
  geom IS NOT NULL
  AND ref_reg IS NOT NULL;