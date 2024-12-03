SELECT 
  id,
  st_multi(ST_SimplifyPreserveTopology(ST_CurveToLine(geom), 0.00001)) geom,
  entity_name,
  url,
  layer_name,
  "façade" as facade,
  ref_reg,
  "Editeur" as editeur,
  source,
  "Observation" as observation,
  "Thematique" as thematique,
  duree_validite,
  temporalite,
  type,
  date,
  date_fin,
  "Edition" as edition,
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
        COALESCE(duree_validite::text, '') ||
        COALESCE(temporalite::text, '') ||
        COALESCE(type::text, '') ||
        COALESCE(date::text, '') ||
        COALESCE(date_fin::text, '') ||
        COALESCE("Edition"::text, '') 
  ) as row_hash
FROM prod."REG_ENV_V3"
WHERE 
  geom IS NOT NULL
  AND entity_name IS NOT NULL
  AND layer_name IS NOT NULL
  AND "Thematique" IS NOT NULL
  AND id IN :ids
