INSERT INTO public.regulations_cacem ( geom)
SELECT st_setsrid(st_makepoint(0,0), 4326)