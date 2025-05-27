CREATE TABLE public.localized_areas
(
    id               SERIAL PRIMARY KEY,
    geom             geometry(MultiPolygon,4326),
    "name"           character varying,
    group_name       character varying,
	control_unit_ids INTEGER[],
	amp_ids          INTEGER[]
);