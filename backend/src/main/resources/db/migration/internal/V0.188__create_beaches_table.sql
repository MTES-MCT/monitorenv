CREATE TABLE public.beaches
(
    id         SERIAL PRIMARY KEY,
    geom       geometry(MultiPoint, 4326),
    nom        character varying,
    nom_offici character varying,
    code_posta character varying,
    insee      character varying
);

CREATE INDEX sidx_beaches_geom ON public.beaches USING gist (geom);