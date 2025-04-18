CREATE TABLE public.marine_cultures_85
(
    id      SERIAL PRIMARY KEY,
    geom    geometry(MultiPolygon,4326),
    "name"    character varying
);

CREATE INDEX sidx_marine_cultures_85_geom ON public.marine_cultures_85 USING gist (geom);

CREATE TABLE public.gulf_of_lion_marine_park
(
    id      SERIAL PRIMARY KEY,
    geom    geometry(MultiPolygon,4326),
    "name"    character varying
);

CREATE INDEX sidx_gulf_of_lion_marine_park_geom ON public.gulf_of_lion_marine_park USING gist (geom);
