
CREATE TABLE public.semaphores (
    id bigint NOT NULL PRIMARY KEY,
    geom public.geometry(Point,4326),
    nom text,
    dept text,
    facade character varying(20),
    administration text,
    unite text,
    email text,
    telephone text,
    base text
);

CREATE INDEX semaphores_geom_sidx ON public.semaphores USING gist (geom);
