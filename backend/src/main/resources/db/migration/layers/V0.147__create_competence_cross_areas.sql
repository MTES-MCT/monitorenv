CREATE TABLE public.competence_cross_areas
(
    id            integer NOT NULL,
    geom          geometry(LineStringZ, 4326),
    "name"        character varying,
    "description" character varying,
    "timestamp"   timestamp without time zone,
    "begin"       timestamp without time zone,
    "end"         timestamp without time zone,
    altitude_mode character varying,
    tessellate    integer,
    extrude       integer,
    visibility    integer,
    draw_order    integer,
    icon          character varying
);

CREATE INDEX sidx_competence_cross_areas_geom ON public.competence_cross_areas USING gist (geom);
