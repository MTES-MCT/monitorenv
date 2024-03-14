CREATE SEQUENCE IF NOT EXISTS public.facade_areas_new_unextended_id_seq;

CREATE TABLE IF NOT EXISTS public.facade_areas_unextended
(
    id integer NOT NULL DEFAULT nextval('public.facade_areas_new_unextended_id_seq'::regclass),
    geom geometry(MultiPolygon,4326),
    facade text,
    CONSTRAINT facade_areas_new_unextended_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_facade_areas_unextended_geom ON public.facade_areas_unextended USING gist (geom);

-- Add missing index (cf. migration 0.114)
CREATE INDEX low_water_line_geom_sidx ON public.low_water_line USING gist (geom);