SELECT
    id,
    md5(
        COALESCE(url::text, '') ||
        COALESCE(layer_name::text, '') ||
        COALESCE(facade::text, '') ||
        COALESCE(editeur::text, '') ||
        COALESCE(source::text, '') ||
        COALESCE(observation::text, '') ||
        COALESCE(thematique::text, '') ||
        COALESCE(duree_validite::text, '')||
        COALESCE(temporalite::text, '')||
        COALESCE(type::text, '') ||
        COALESCE(date::text, '') ||
        COALESCE(date_fin::text, '') ||
        COALESCE(plan::text, '') ||
        COALESCE(poly_name::text, '') ||
        COALESCE(resume::text, '') ||
        COALESCE(authorization_periods::text, '') ||
        COALESCE(prohibition_periods::text, '') ||
        COALESCE(additional_ref_reg::text, '')
  ) AS monitorenv_row_hash
FROM public.regulatory_areas;
