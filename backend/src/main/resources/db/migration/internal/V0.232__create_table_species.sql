CREATE TABLE species
(
    id                serial,
    species_code      varchar,
    species_name      varchar,
    scip_species_type varchar
);

ALTER TABLE tags
    ADD COLUMN code_fao varchar;