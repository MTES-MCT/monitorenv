SELECT 
    ogc_fid,
    nature,
    type,
    descriptio,
    reference,
    beginlifes,
    territory,
    country,
    agency,
    inspireid,
    geom 
	FROM prod.straight_baseline
  WHERE geom IS NOT NULL;