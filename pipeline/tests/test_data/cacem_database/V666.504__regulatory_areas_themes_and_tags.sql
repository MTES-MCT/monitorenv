CREATE SCHEMA IF NOT EXISTS prod;
DROP TABLE IF EXISTS prod."REG_ENV_V3" CASCADE;

CREATE TABLE IF NOT EXISTS prod."REG_ENV_V3"
(
    id             serial primary key,
    geom           geometry(MultiPolygon, 4326),
    url            varchar,
    layer_name     varchar,
    facade         varchar,
    ref_reg        varchar,
    edition        date,
    editeur        varchar,
    source         varchar,
    obs            varchar,
    thematique     varchar,
    date           date,
    validite       varchar,
    date_fin       date,
    tempo          varchar,
    type           varchar,
    resume         text,
    poly_name      text,
    plan           text
);

/* THEMES */
DROP TABLE IF EXISTS prod.themes CASCADE;
CREATE TABLE prod.themes (
    id                                    SERIAL PRIMARY KEY,
    "name"                                varchar,
    parent_id                             INT REFERENCES prod.themes (id),
    started_at                            timestamp,
    ended_at                              timestamp,
    control_plan_themes_id                INT,
    control_plan_sub_themes_id            INT,
    control_plan_tags_id                  INT,
    reportings_control_plan_sub_themes_id INT
);

/* REGULATORY_AREAS_THEMES */
DROP TABLE IF EXISTS prod.themes_regulatory_areas;
CREATE TABLE prod.themes_regulatory_areas (
    themes_id           INT REFERENCES prod.themes (id),
    regulatory_areas_id INT REFERENCES prod."REG_ENV_V3" (id),
    PRIMARY KEY (themes_id, regulatory_areas_id)
);

/* TAGS */
DROP TABLE IF EXISTS prod.tags CASCADE;
CREATE TABLE prod.tags (
    id           SERIAL PRIMARY KEY,
    "name"       varchar,
    parent_id    INT REFERENCES prod.tags (id),
    started_at   timestamp,
    ended_at     timestamp
);

/* REGULATORY_AREAS_TAGS */
DROP TABLE IF EXISTS prod.tags_regulatory_areas;
CREATE TABLE prod.tags_regulatory_areas (
    tags_id             INT REFERENCES prod.tags (id),
    regulatory_areas_id INT REFERENCES prod."REG_ENV_V3" (id),
    PRIMARY KEY (tags_id, regulatory_areas_id)
);

insert into prod."REG_ENV_V3" (id, geom, url, layer_name, facade, ref_reg, edition, editeur, source, obs, thematique, date, validite, date_fin, tempo, type, resume, poly_name, plan) values (1, 'MULTIPOLYGON(((0 0,10 0,10 10,0 10,0 0)))', 'url1', 'layer_name1', 'MED', 'ref_reg1', '2025-01-01', 'editrice1', 'source1', 'observation1', 'thematique1', '2010-06-01', '10 ans', '2024-01-01', 'temporaire', 'Décret', 'resume1', 'polyname1', 'plan1');
insert into prod."REG_ENV_V3" (id, geom, url, layer_name, facade, ref_reg, edition, editeur, source, obs, thematique, date, validite, date_fin, tempo, type, resume, poly_name, plan) values (2, 'MULTIPOLYGON(((120 -20,135 -20,135 -10,120 -10,120 -20)))', 'url2', 'layer_name2', 'NAMO', 'ref_reg2', '2025-01-01', 'editeur2', 'source2', 'observation2', 'thematique2', '2005-07-01', '20 ans', '2025-01-01', 'permanent', 'Arrêté préfectoral', 'resume2', 'polyname2', 'plan2');