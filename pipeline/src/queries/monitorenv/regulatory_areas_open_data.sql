
SELECT 
    ra.id,
    ra.creation::timestamp,
    ra.url,
    ra.layer_name,
    ra.facade,
    ra.ref_reg,
    GREATEST(ra.edition_bo::timestamp, ra.edition_cacem::timestamp) as edition,
    ra.editeur,
    ra.source,
    ra.observation,
    ra.date::timestamp,
    ra.date_fin::timestamp,
    ra.type,
    ST_ASTEXT(ST_CurveToLine(ra.geom)) AS wkt,
    ra.resume,
    ra.poly_name,
    ra.plan,
    ra.geom as geometry,
    ra.authorization_periods,
    ra.prohibition_periods,
    ra.additional_ref_reg,
    ra.location,
    COALESCE(STRING_AGG(DISTINCT CASE WHEN t.parent_id IS NULL THEN t.name END, ',' ORDER BY CASE WHEN t.parent_id IS NULL THEN t.name END)::text, '') as themes,
    COALESCE(STRING_AGG(DISTINCT CASE WHEN t.parent_id IS NOT NULL THEN t.name END, ',' ORDER BY CASE WHEN t.parent_id IS NOT NULL THEN t.name END)::text, '') as sub_themes,
    COALESCE(STRING_AGG(DISTINCT CASE WHEN tag.parent_id IS NULL THEN tag.name END, ',' ORDER BY CASE WHEN tag.parent_id IS NULL THEN tag.name END)::text, '') as tags,
    COALESCE(STRING_AGG(DISTINCT CASE WHEN tag.parent_id IS NOT NULL THEN tag.name END, ',' ORDER BY CASE WHEN tag.parent_id IS NOT NULL THEN tag.name END)::text, '') as sub_tags
FROM public.regulatory_areas ra
LEFT JOIN themes_regulatory_areas tra
       ON tra.regulatory_areas_id = ra.id
LEFT JOIN themes t
       ON t.id = tra.themes_id
LEFT JOIN tags_regulatory_areas trt
       ON trt.regulatory_areas_id = ra.id
LEFT JOIN tags tag
       ON tag.id = trt.tags_id
WHERE ra.poly_name IS NOT NULL
and ra.area_type = 'ZONE'
GROUP BY ra.id;