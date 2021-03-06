CREATE TABLE public.nafo_regulatory_area (
    id_0 integer NOT NULL,
    geom public.geometry(MultiPolygon,4326),
    id character varying,
    "F_CODE" character varying,
    "F_LEVEL" character varying,
    "F_STATUS" integer,
    "OCEAN" character varying,
    "SUBOCEAN" character varying,
    "F_AREA" character varying,
    "F_SUBAREA" character varying,
    "F_DIVISION" character varying,
    "F_SUBDIVIS" character varying,
    "F_SUBUNIT" character varying,
    "ID" integer,
    "NAME_EN" character varying,
    "NAME_FR" character varying,
    "NAME_ES" character varying,
    fid bigint,
    gid integer,
    name character varying(254),
    mrgid bigint,
    source character varying(254),
    area_km2 bigint
);
