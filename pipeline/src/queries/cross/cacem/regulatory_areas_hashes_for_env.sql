SELECT
    id,
    md5(
        COALESCE(geom::text, '') ||
        COALESCE(ref_reg::text, '')
  ) AS cacem_row_hash
FROM prod.reg_cacem
WHERE 
  geom IS NOT NULL
  AND ref_reg IS NOT NULL;
