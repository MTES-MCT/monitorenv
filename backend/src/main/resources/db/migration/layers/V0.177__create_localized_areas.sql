CREATE TABLE public.marine_cultures_85
(
    id      SERIAL PRIMARY KEY,
    geom    geometry(MultiPolygon,4326),
    "name"    character varying
);

CREATE INDEX sidx_marine_cultures_85_geom ON public.marine_cultures_85 USING gist (geom);
