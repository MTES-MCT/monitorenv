CREATE TABLE IF NOT EXISTS public.coastal_municipalities_areas
(
    id          SERIAL PRIMARY KEY,
    insee_dep   integer,
    insee_com   integer,
    geom        geometry(MultiPolygon, 4326),
    nom_com     character varying
);

CREATE INDEX IF NOT EXISTS sidx_coastal_municipalities_areas_geom
    ON public.coastal_municipalities_areas USING gist (geom);
