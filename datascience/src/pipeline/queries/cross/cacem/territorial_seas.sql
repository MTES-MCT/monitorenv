SELECT 
  ogc_fid,
  inspireid,
  type,
  descriptio,
  surface,
  reference,
  beginlifes,
  territory,
  country,
  agency,
  geom
FROM prod.territorial_seas
WHERE geom IS NOT NULL
