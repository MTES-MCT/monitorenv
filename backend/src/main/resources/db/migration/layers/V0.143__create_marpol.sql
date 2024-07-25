
CREATE TABLE public.marpol (
    id integer PRIMARY KEY,
    geom geometry(MultiPolygon,4326),
    zone character varying(254),
    zone_neca character varying(10),
    zone_seca character varying(10)
);

CREATE INDEX sidx_marpol_geom ON public.marpol USING gist (geom);
