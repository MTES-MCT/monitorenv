
CREATE TABLE IF NOT EXISTS public.facade_areas_unextended
(
    id integer NOT NULL DEFAULT nextval('public.facade_areas_new_unextended_id_seq'::regclass),
    geom geometry(MultiPolygon,4326),
    facade text,
    CONSTRAINT facade_areas_new_unextended_pkey PRIMARY KEY (id)
);