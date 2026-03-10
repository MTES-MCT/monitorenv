
SELECT 
    id,
    url,
    layer_name,
    facade,
    ref_reg,
    edition_bo::timestamp as "edition",
    editeur,
    source,
    thematique,
    observation,
    date::timestamp,
    date_fin::timestamp,
    duree_validite,
    temporalite,
    type,
    ST_ASTEXT(ST_CurveToLine(geom)) AS wkt,
    resume,
    poly_name,
    plan,
    geom as geometry,
    authorization_periods,
    prohibition_periods,
    additional_ref_reg,
    themes,
    tags
FROM prod.reg_cacem
WHERE poly_name IS NOT NULL;