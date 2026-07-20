SELECT
    ra.id,
    md5(
        COALESCE(ra.url::text, '') ||
        COALESCE(ra.layer_name::text, '') ||
        COALESCE(ra.facade::text, '') ||
        COALESCE(ra.editeur::text, '') ||
        COALESCE(ra.source::text, '') ||
        COALESCE(ra.observation::text, '') ||
        COALESCE(ra.type::text, '') ||
        COALESCE(ra.date::date::text, '') ||
        COALESCE(ra.date_fin::date::text, '') ||
        COALESCE(ra.plan::text, '') ||
        COALESCE(ra.poly_name::text, '') ||
        COALESCE(ra.resume::text, '') ||
        COALESCE(ra.authorization_periods::text, '') ||
        COALESCE(ra.prohibition_periods::text, '') ||
        COALESCE(ra.additional_ref_reg::text, '') ||
        COALESCE(STRING_AGG(DISTINCT t.name, ',' ORDER BY t.name)::text, '') ||
        COALESCE(STRING_AGG(DISTINCT tag.name, ',' ORDER BY tag.name)::text, '')
  ) AS monitorenv_row_hash
FROM public.regulatory_areas ra
LEFT JOIN themes_regulatory_areas tra
       ON tra.regulatory_areas_id = ra.id
LEFT JOIN themes t
       ON t.id = tra.themes_id
LEFT JOIN tags_regulatory_areas trt
       ON trt.regulatory_areas_id = ra.id
LEFT JOIN tags tag
       ON tag.id = trt.tags_id
WHERE area_type = 'ZONE'
GROUP BY ra.id;

