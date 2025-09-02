CREATE TABLE public.beaches
(
    id            SERIAL PRIMARY KEY,
    geom          geometry(MultiPoint, 4326),
    name          character varying,
    official_name character varying,
    postcode      character varying,
    insee         character varying
);

CREATE INDEX sidx_beaches_geom ON public.beaches USING gist (geom);