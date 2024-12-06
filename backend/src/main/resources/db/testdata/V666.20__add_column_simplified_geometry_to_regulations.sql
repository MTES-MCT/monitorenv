UPDATE public.regulations_cacem
SET geometry_simplified = ST_multi(ST_MakeValid(ST_SimplifyPreserveTopology(ST_CurveToLine(geom), 0.0001)));