SELECT amp.id,
md5(
  coalesce(amp.id::text,'')||
  coalesce(geom::text,'')||
  coalesce(mpa_oriname,'')||
  coalesce(des_desigfr,'')||
  coalesce(mpa_type,'') ||
  coalesce(mpa_type_cacem,'')||
  coalesce(url_legicem,'')
  ) as cacem_row_hash
	FROM 
    prod."Aires marines protégées" amp
    LEFT OUTER JOIN prod.amp_metadata_cacem ON (amp.id = amp_metadata_cacem.id)
  WHERE
    geom IS NOT NULL 
    AND st_isvalid(geom)
    AND mpa_oriname IS NOT NULL
    AND des_desigfr IS NOT NULL