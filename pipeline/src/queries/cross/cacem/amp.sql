SELECT id,
st_multi(ST_SimplifyPreserveTopology(ST_CurveToLine(geom), 0.00001)) geom,
mpa_oriname,
des_desigfr,
mpa_type,
ref_reg,
url_legicem,
mpa_updatewhen AS updated_at,
md5(
  coalesce(id::text,'')||
  coalesce(geom::text,'')||
  coalesce(mpa_oriname,'')||
  coalesce(des_desigfr,'')||
  coalesce(mpa_type,'') ||
  coalesce(ref_reg,'')||
  coalesce(url_legicem,'') ||
  coalesce(mpa_updatewhen,'')
  ) as row_hash
	FROM prod."Aires marines protégées"
  WHERE
    geom IS NOT NULL 
    AND st_isvalid(geom)
    AND mpa_oriname IS NOT NULL
    AND des_desigfr IS NOT NULL
    AND id IN :ids