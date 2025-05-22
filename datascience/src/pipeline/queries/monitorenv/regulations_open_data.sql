SELECT 
    id,
    entity_name,
    url,
    layer_name,
    facade,
    ref_reg,
    edition,
    editeur,
    source,
    thematique,
    observation,
    date,
    duree_validite,
    temporalite,
    type,
    geom as geometry,
    ST_ASTEXT(ST_CurveToLine(geom)) AS wkt
FROM public.regulations_cacem