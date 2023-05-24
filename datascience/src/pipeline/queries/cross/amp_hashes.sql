SELECT id,
md5(
  coalesce(id,'')||
  coalesce(geom,'')||
  coalesce(mpa_oriname,'')||
  coalesce(des_desigfr,'')||
  ) as cacem_row_hash
	FROM prod."Aires marines protégées"
  WHERE
    geom IS NOT NULL 
    AND st_isvalid(geom)
    AND mpa_oriname IS NOT NULL
    AND des_desigfr IS NOT NULL