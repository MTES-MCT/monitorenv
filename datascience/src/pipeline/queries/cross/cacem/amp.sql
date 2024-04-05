SELECT amp.id,
st_multi(ST_SimplifyPreserveTopology(ST_CurveToLine(geom), 0.00001)) geom,
mpa_oriname,
des_desigfr,
mpa_type,
mpa_type_cacem,
url_legicem,
md5(
  coalesce(amp.id::text,'')||
  coalesce(geom::text,'')||
  coalesce(mpa_oriname,'')||
  coalesce(des_desigfr,'')||
  coalesce(mpa_type,'') ||
  coalesce(mpa_type_cacem,'')||
  coalesce(url_legicem,'')
  ) as row_hash
	FROM prod."Aires marines protégées" amp
    LEFT OUTER JOIN prod.amp_metadata_cacem ON (amp.id = amp_metadata_cacem.id)
  WHERE
    geom IS NOT NULL 
    AND st_isvalid(geom)
    AND mpa_oriname IS NOT NULL
    AND des_desigfr IS NOT NULL
    AND amp.id IN :ids