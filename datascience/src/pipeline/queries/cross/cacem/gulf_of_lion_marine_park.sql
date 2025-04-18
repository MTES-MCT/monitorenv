SELECT
  id,
  geom,
  nom AS "name"
FROM prod.loc_pnmgdl
WHERE geom IS NOT NULL;