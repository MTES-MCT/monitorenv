CREATE TABLE public.marine_cultures
(
    id      SERIAL PRIMARY KEY,
    geom    geometry(MultiPolygon,4326),
    "name"    character varying
);

CREATE INDEX sidx_marine_cultures_geom ON public.marine_cultures USING gist (geom);
