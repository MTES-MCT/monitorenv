SELECT 
  id,
  st_multi(ST_SimplifyPreserveTopology(ST_CurveToLine(geom), 0.00001)) geom,
  ref_reg,
  date_modif AS edition_cacem,
  md5(
        COALESCE(geom::text, '') ||
        COALESCE(ref_reg::text, '') ||
        COALESCE(date_modif::text, '')
  ) as row_hash
FROM prod.reg_cacem
WHERE 
  geom IS NOT NULL
  AND ref_reg IS NOT NULL
  AND id IN :ids