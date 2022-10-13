ALTER TABLE public.facade_areas_subdivided ADD COLUMN id SERIAL;
ALTER TABLE public.facade_areas_subdivided ALTER COLUMN geometry TYPE geometry(MULTIPOLYGON, 4326) USING st_multi(geometry);