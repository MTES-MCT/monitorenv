SELECT id, geom, nature, type, descriptio, reference, beginlifes, territory, country, agency, inspireid
	FROM public.straight_baseline
  WHERE geom IS NOT NULL;