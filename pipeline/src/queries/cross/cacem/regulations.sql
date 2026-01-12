SELECT 
  id,
  st_multi(ST_SimplifyPreserveTopology(ST_CurveToLine(geom), 0.00001)) geom,
  ent_name AS entity_name,
  url,
  layer_name,
  facade,
  ref_reg,
  editeur,
  source,
  obs AS observation,
  thematique,
  validite AS duree_validite,
  tempo AS temporalite,
  type,
  date,
  date_fin,
  edition,
  plan,
  poly_name,
  resume,
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
        COALESCE(validite::text, '') ||
        COALESCE(tempo::text, '') ||
        COALESCE(type::text, '') ||
        COALESCE(date::text, '') ||
        COALESCE(date_fin::text, '') ||
        COALESCE(edition::text, '') ||
        COALESCE(plan::text, '') ||
        COALESCE(poly_name::text, '') ||
        COALESCE(resume::text, '')
  ) as row_hash
FROM prod."REG_ENV_V3"
WHERE 
  geom IS NOT NULL
  AND ent_name IS NOT NULL
  AND layer_name IS NOT NULL
  AND thematique IS NOT NULL
  AND id IN :ids
