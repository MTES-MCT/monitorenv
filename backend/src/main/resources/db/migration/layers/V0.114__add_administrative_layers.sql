CREATE TABLE IF NOT EXISTS public.transversal_sea_limit_areas (
    id integer PRIMARY KEY,
    geom public.geometry(MultiLineString,4326),
    objnam character varying(254)
);
CREATE INDEX IF NOT EXISTS transversal_sea_limit_areas_geom_sidx ON public.transversal_sea_limit_areas USING gist (geom);


CREATE TABLE IF NOT EXISTS public.saltwater_limit_areas (
    id integer PRIMARY KEY,
    geom public.geometry(MultiLineString,4326),
    objnam character varying(254)
);
CREATE INDEX IF NOT EXISTS saltwater_limit_areas_geom_sidx ON public.saltwater_limit_areas USING gist (geom);

CREATE TABLE IF NOT EXISTS public.territorial_seas (
  ogc_fid integer PRIMARY KEY,
  inspireid text,
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
CREATE INDEX IF NOT EXISTS territorial_seas_geom_sidx ON public.territorial_seas USING gist (geom);

CREATE TABLE IF NOT EXISTS public.straight_baseline (
    ogc_fid integer PRIMARY KEY,
    inspireid text,
    geom geometry(MultiLineString,4326),
    nature text,
    type text,
    descriptio text,
    reference text,
    beginlifes text,
    territory text,
    country text,
    agency text
);
CREATE INDEX IF NOT EXISTS straight_baseline_geom_sidx ON public.straight_baseline USING gist (geom);

CREATE TABLE IF NOT EXISTS public.low_water_line (
  ogc_fid integer PRIMARY KEY,
  gid integer,
  gml_id text,
  cdlaisseea numeric,
  typelaisse text,
  geom geometry(MultiLineString,4326)
);