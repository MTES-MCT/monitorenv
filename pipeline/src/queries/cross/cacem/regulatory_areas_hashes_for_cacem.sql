SELECT
    id,
    md5(
        COALESCE(url::text, '') ||
        COALESCE(layer_name::text, '') ||
        COALESCE(facade::text, '') ||
        COALESCE(editeur::text, '') ||
        COALESCE(source::text, '') ||
        COALESCE(observation::text, '') ||
        COALESCE(type::text, '') ||
        COALESCE(date::text, '') ||
        COALESCE(date_fin::text, '') ||
        COALESCE(plan::text, '') ||
        COALESCE(poly_name::text, '') ||
        COALESCE(resume::text, '') ||
        COALESCE(authorization_periods::text, '') ||
        COALESCE(prohibition_periods::text, '') ||
        COALESCE(additional_ref_reg::text, '') ||
        COALESCE(themes::text, '') ||
        COALESCE(tags::text, '')
  ) AS cacem_row_hash
FROM prod.reg_cacem;
