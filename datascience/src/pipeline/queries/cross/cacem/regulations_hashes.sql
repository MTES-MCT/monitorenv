SELECT 
    id,
    md5(
        COALESCE(geom::text, '') ||
        COALESCE(ent_name::text, '') ||
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
        COALESCE(edition::text, '') 
  ) AS cacem_row_hash
FROM prod."REG_ENV_V3"
WHERE 
  geom IS NOT NULL
  AND ent_name IS NOT NULL
  AND layer_name IS NOT NULL
  AND thematique IS NOT NULL