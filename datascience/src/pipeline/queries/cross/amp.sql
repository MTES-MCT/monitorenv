SELECT id,
geom,
mpa_oriname,
des_desigfr,
md5(
  coalesce(id,'')||
  coalesce(geom,'')||
  coalesce(mpa_oriname,'')||
  coalesce(des_desigfr,'')||
  ) as row_hash
	FROM prod."Aires marines protégées"
  WHERE
    geom IS NOT NULL 
    AND st_isvalid(geom)
    AND mpa_oriname IS NOT NULL
    AND des_desigfr IS NOT NULL
    AND id IN :ids