CREATE SCHEMA IF NOT EXISTS prod;
DROP TABLE IF EXISTS prod.localized_areas;
CREATE TABLE prod.localized_areas (
     id               SERIAL PRIMARY KEY,
    geom             geometry(MultiPolygon,4326),
    "name"           character varying,
    group_name       character varying,
	control_unit_ids INTEGER[],
	amp_ids          INTEGER[]
);


INSERT INTO prod.localized_areas VALUES (1, '0106000020E61000000100000001030000000100000008000000A26148C2679001C056BFFE3E3D7D47407FEC0E55159501C0E2F2B845B37D4740FC031AFB7A9D01C084717475407E474074D93921277F01C0740323C9F37E47403905F682AC7A01C0FD67E71AD27E4740805C4235A96001C007C2FBF08C7D4740FB6146C2679001C033E6FD3E3D7D4740A26148C2679001C056BFFE3E3D7D4740', 'Châtelet', 'Cultures marines 85', '{10000,10018}', '{3}');


CREATE INDEX sidx_localized_areas_geom ON prod.localized_areas USING gist (geom);

