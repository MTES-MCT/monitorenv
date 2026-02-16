SELECT 
    id,
    md5(
        COALESCE(geom::text, '') ||
        COALESCE(url::text, '') ||
        COALESCE(layer_name::text, '') ||
        COALESCE(facade::text, '') ||
        COALESCE(ref_reg::text, '') ||
        COALESCE(editeur::text, '') ||
        COALESCE(source::text, '') ||
        COALESCE(observation::text, '') ||
        COALESCE(thematique::text, '') ||
        COALESCE(duree_validite::text, '')||
        COALESCE(temporalite::text, '')||
        COALESCE(type::text, '') ||
        COALESCE(date::text, '') ||
        COALESCE(date_fin::text, '') ||
        COALESCE(edition_cacem::text, '') || 
        COALESCE(edition_bo::text, '') || 
        COALESCE(plan::text, '') ||
        COALESCE(poly_name::text, '') ||
        COALESCE(resume::text, '') ||
        COALESCE(authorization_periods::text, '') ||
        COALESCE(prohibition_periods::text, '') ||
        COALESCE(others_ref_reg::text, '') ||
        COALESCE(creation::text, '')
  ) AS cacem_row_hash
FROM prod.reg_cacem
WHERE 
  geom IS NOT NULL
  AND ref_reg IS NOT NULL;