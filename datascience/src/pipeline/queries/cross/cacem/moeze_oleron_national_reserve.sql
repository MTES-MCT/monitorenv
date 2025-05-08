SELECT
  id,
  geom,
  nom AS "name"
FROM prod.loc_rnnmo
WHERE geom IS NOT NULL;