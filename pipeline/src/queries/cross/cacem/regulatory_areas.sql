SELECT 
  id,
  st_multi(ST_SimplifyPreserveTopology(ST_CurveToLine(geom), 0.00001)) geom,
  url,        
  layer_name,
  facade,
  creation,
  edition_bo,
  edition_cacem,
  editeur,
  source,
  observation,
  date,
  date_fin,
  type,
  ref_reg,
  resume,
  poly_name,
  plan,
  authorization_periods,
  prohibition_periods,
  additional_ref_reg,
  location,
  md5(
    COALESCE(st_multi(ST_SimplifyPreserveTopology(ST_CurveToLine(geom), 0.00001))::text, '') ||
    COALESCE(ref_reg::text, '')
  ) AS row_hash
FROM prod.reg_cacem
WHERE 
  geom IS NOT NULL
  AND ref_reg IS NOT NULL
  AND id IN :ids;