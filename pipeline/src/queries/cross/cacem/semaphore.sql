SELECT 
  id,
  geom,
  nom,
  dept,
  facade,
  administration,
  unite,
  email,
  telephone,
  base,
  "url"
FROM prod.semaphore
WHERE geom IS NOT NULL and nom IS NOT NULL