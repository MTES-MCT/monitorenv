SELECT
  id,
  geom,
  nom AS "name"
FROM prod.loc_cm_33
WHERE geom IS NOT NULL;