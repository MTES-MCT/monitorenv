CREATE SCHEMA IF NOT EXISTS prod;
DROP TABLE IF EXISTS prod."REG_ENV_V3" CASCADE;

CREATE TABLE IF NOT EXISTS prod."REG_ENV_V3"
(
    id             serial primary key,
    geom           geometry(MultiPolygon, 4326),
    ent_name       varchar,
    url            varchar,
    layer_name     varchar,
    facade         varchar,
    ref_reg        varchar,
    edition        varchar,
    editeur        varchar,
    source         varchar,
    obs            varchar,
    thematique     varchar,
    date           varchar,
    validite       varchar,
    date_fin       varchar,
    tempo          varchar,
    type           varchar,
    row_hash       text
);

/* THEMES */
DROP TABLE IF EXISTS prod.themes CASCADE;
CREATE TABLE prod.themes (
    id           SERIAL PRIMARY KEY,
    "name"       varchar,
    parent_id    INT REFERENCES prod.themes (id),
    started_at   timestamp,
    ended_at     timestamp
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