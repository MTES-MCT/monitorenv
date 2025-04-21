CREATE TABLE public.marine_cultures_85
(
    id        SERIAL PRIMARY KEY,
    geom      geometry(MultiPolygon,4326),
    "name"    character varying
);

CREATE INDEX sidx_marine_cultures_85_geom ON public.marine_cultures_85 USING gist (geom);

CREATE TABLE public.gulf_of_lion_marine_park
(
    id        SERIAL PRIMARY KEY,
    geom      geometry(MultiPolygon,4326),
    "name"    character varying
);

CREATE INDEX sidx_gulf_of_lion_marine_park_geom ON public.gulf_of_lion_marine_park USING gist (geom);

CREATE TABLE public.cerbere_banyuls_national_reserve
(
    id        SERIAL PRIMARY KEY,
    geom      geometry(MultiPolygon,4326),
    "name"    character varying
);

CREATE INDEX sidx_cerbere_banyuls_national_reserve_geom ON public.cerbere_banyuls_national_reserve USING gist (geom);


CREATE TABLE public.moeze_oleron_national_reserve
(
    id        SERIAL PRIMARY KEY,
    geom      geometry(MultiPolygon,4326),
    "name"    character varying
);

CREATE INDEX sidx_moeze_oleron_national_reserve_geom ON public.moeze_oleron_national_reserve USING gist (geom);

