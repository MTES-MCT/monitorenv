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
"Echelle" as echelle,
duree_validite,
temporalite,
"action",
objet,
type,
signataire,
date,
date_fin,
"Edition" as edition
FROM prod."REG_ENV_V3"
WHERE 
  geom IS NOT NULL
  AND entity_name IS NOT NULL
  AND layer_name IS NOT NULL
  AND "Thematique" IS NOT NULL