UPDATE public.regulations_cacem SET row_hash = md5(
    COALESCE(geom::text, '') ||
    COALESCE(url::text, '') ||
    COALESCE(layer_name::text, '') ||
    COALESCE(facade::text, '') ||
    COALESCE(ref_reg::text, '') ||
    COALESCE(editeur::text, '') ||
    COALESCE(source::text, '') ||
    COALESCE(obs::text, '') ||
    COALESCE(thematique::text, '') ||
    COALESCE(validite::text, '')||
    COALESCE(tempo::text, '')||
    COALESCE(type::text, '') ||
    COALESCE(date::text, '') ||
    COALESCE(date_fin::text, '') ||
    COALESCE(edition::text, '') || 
    COALESCE(plan::text, '') ||
    COALESCE(poly_name::text, '') ||
    COALESCE(resume::text, '')
);