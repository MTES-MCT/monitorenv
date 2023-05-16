
CREATE TABLE public.semaphores (
    id int NOT NULL PRIMARY KEY,
    geom public.geometry(Point,4326) NOT NULL,
    nom text NOT NULL,
    dept text,
    facade character varying(20),
    administration text,
    unite text,
    email text,
    telephone text,
    base text
);

CREATE INDEX semaphores_geom_sidx ON public.semaphores USING gist (geom);
