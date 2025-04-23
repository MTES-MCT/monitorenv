CREATE SCHEMA IF NOT EXISTS prod;

DROP TABLE IF EXISTS prod.themes_regulatory_areas;
CREATE TABLE prod.themes_regulatory_areas (
    themes_id           integer,
    regulatory_areas_id integer
);
INSERT INTO prod.themes_regulatory_areas VALUES (1,1);
INSERT INTO prod.themes_regulatory_areas VALUES (67,89);

DROP TABLE IF EXISTS prod.tags_regulatory_areas;
CREATE TABLE prod.tags_regulatory_areas (
    tags_id           integer,
    regulatory_areas_id integer
);
INSERT INTO prod.tags_regulatory_areas VALUES (2,2);
INSERT INTO prod.tags_regulatory_areas VALUES (34,76);


