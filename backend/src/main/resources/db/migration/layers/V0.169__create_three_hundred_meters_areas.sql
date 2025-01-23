CREATE TABLE public.three_hundred_meters_areas
(
    id      SERIAL PRIMARY KEY,
    geom    geometry(MultiLineString,4326),
    secteur character varying
);

CREATE INDEX sidx_three_hundred_meters_areas_geom ON public.three_hundred_meters_areas USING gist (geom);
