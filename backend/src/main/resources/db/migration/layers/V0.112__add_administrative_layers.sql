CREATE TABLE public.transversal_sea_limit_areas (
    id integer PRIMARY KEY,
    geom public.geometry(MultiLineString,4326),
    objnam character varying(254)
);
CREATE INDEX transversal_sea_limit_areas_geom_sidx ON public.transversal_sea_limit_areas USING gist (geom);


CREATE TABLE public.saltwater_limit_areas (
    id integer PRIMARY KEY,
    geom public.geometry(MultiLineString,4326),
    objnam character varying(254)
);
CREATE INDEX saltwater_limit_areas_geom_sidx ON public.saltwater_limit_areas USING gist (geom);

CREATE TABLE public.territorial_seas (
  inspireid text primary key,
  type text,
  descriptio text,
  surface numeric,
  reference text,
  beginlifes text,
  territory text,
  country text,
  agency text,
  geom geometry(MultiPolygon,4326)
);
CREATE INDEX territorial_seas_geom_sidx ON public.territorial_seas USING gist (geom);

CREATE TABLE public.straight_baseline (
    inspireid text primary key,
    geom geometry(MultiLineString,4326),
    nature text,
    type text,
    descriptio text,
    reference text,
    beginlifes text,
    territory text,
    country text,
    agency text,
);
CREATE INDEX straight_baseline_geom_sidx ON public.straight_baseline USING gist (geom);