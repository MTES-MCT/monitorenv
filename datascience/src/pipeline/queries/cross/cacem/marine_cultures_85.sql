SELECT
  id,
  geom,
  nom AS "name"
FROM prod.loc_cm_85
WHERE geom IS NOT NULL;