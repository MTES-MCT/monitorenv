SELECT
    id,
    md5(
        COALESCE(geom::text, '') ||
        COALESCE(ref_reg::text, '')
  ) AS monitorenv_row_hash
FROM public.regulatory_areas;