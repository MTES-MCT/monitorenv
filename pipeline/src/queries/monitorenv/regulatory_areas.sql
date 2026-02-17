SELECT
    ra.id,
    st_multi(ST_SimplifyPreserveTopology(ST_CurveToLine(geom), 0.00001)) ra.geom,
    ra.url,
    ra.layer_name,
    ra.facade,
    ra.creation,
    ra.edition_bo,
    ra.edition_cacem,
    ra.editeur,
    ra.source,
    ra.observation,
    ra.thematique,
    ra.date,
    ra.duree_validite,
    ra.date_fin,
    ra.temporalite,
    ra.type,
    ra.ref_reg,
    ra.resume,
    ra.poly_name,
    ra.plan,
    ra.authorization_periods,
    ra.prohibition_periods,
    ra.others_ref_reg,
    STRING_AGG(DISTINCT t.name, ',') AS themes,
    STRING_AGG(DISTINCT tag.name, ',') AS tags
FROM regulatory_areas ra
LEFT JOIN themes_regulatory_areas_new tra
       ON tra.regulatory_areas_id = ra.id
LEFT JOIN themes t
       ON t.id = tra.themes_id
LEFT JOIN tags_regulatory_areas_new trt
       ON trt.regulatory_areas_id = ra.id
LEFT JOIN tags tag
       ON tag.id = trt.tags_id
WHERE ra.id IN :ids
GROUP BY ra.id;