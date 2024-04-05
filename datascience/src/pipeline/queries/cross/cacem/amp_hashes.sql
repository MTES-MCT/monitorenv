SELECT id,
md5(
  coalesce(id::text,'')||
  coalesce(geom::text,'')||
  coalesce(mpa_oriname,'')||
  coalesce(des_desigfr,'')||
  coalesce(mpa_type,'') ||
  coalesce(ref_reg,'')||
  coalesce(url_legicem,'')
  ) as cacem_row_hash
	FROM 
    prod."Aires marines protégées"
  WHERE
    geom IS NOT NULL 
    AND st_isvalid(geom)
    AND mpa_oriname IS NOT NULL
    AND des_desigfr IS NOT NULL