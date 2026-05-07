ALTER TABLE public.regulatory_areas ADD COLUMN geom_simplified geometry(MultiPolygon,4326);
UPDATE public.regulatory_areas SET geom_simplified = ST_SimplifyPreserveTopology(ST_CurveToLine(geom), 0.0001);

CREATE INDEX regulatory_areas_sidx ON public.regulatory_areas USING gist (geom);
CREATE INDEX regulatory_areas_simplified_sidx ON public.regulatory_areas USING gist (geom_simplified);