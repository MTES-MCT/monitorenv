SELECT
    id,
    row_hash AS monitorenv_row_hash
FROM public.regulatory_areas
WHERE area_type = 'ZONE';