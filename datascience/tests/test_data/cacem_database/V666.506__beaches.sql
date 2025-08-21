CREATE SCHEMA IF NOT EXISTS prod;
DROP TABLE IF EXISTS prod.plageslitto;
CREATE TABLE prod.plageslitto (
    id              SERIAL PRIMARY KEY,
    geom             geometry(MultiPoint,4326),
    nom              character varying,
    nom_offici       character varying,
    code_posta       character varying,
    insee            character varying
);


INSERT INTO prod.plageslitto VALUES (1527, '0104000020E61000000100000001010000007524453440EA1A408C6C58423AB24540', 'La Galiote', 'Fréjus', '83370', '83061');


CREATE INDEX sidx_beaches_geom ON prod.plageslitto USING gist (geom);
