SELECT 
    id,
    md5(
      COALESCE(geom::text, '') ||
      COALESCE(entity_name::text, '') ||
      COALESCE(url::text, '') ||
      COALESCE(layer_name::text, '') ||
      COALESCE("façade"::text, '') ||
      COALESCE(ref_reg::text, '') ||
      COALESCE("Editeur"::text, '') ||
      COALESCE(source::text, '') ||
      COALESCE("Observation"::text, '') ||
      COALESCE("Thematique"::text, '') ||
      COALESCE("Echelle"::text, '') ||
      COALESCE(duree_validite::text, '') ||
      COALESCE(temporalite::text, '') ||
      COALESCE("action"::text, '') ||
      COALESCE(objet::text, '') ||
      COALESCE(type::text, '') ||
      COALESCE(signataire::text, '') ||
      COALESCE(date::text, '') ||
      COALESCE(date_fin::text, '') ||
      COALESCE("Edition"::text, '') 
) AS cacem_row_hash
FROM prod."REG_ENV_V3"
WHERE 
  geom IS NOT NULL
  AND entity_name IS NOT NULL
  AND layer_name IS NOT NULL
  AND "Thematique" IS NOT NULL