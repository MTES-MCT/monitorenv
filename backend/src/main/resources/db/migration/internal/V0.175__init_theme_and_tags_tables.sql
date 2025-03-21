CREATE TABLE themes
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(255)                             NOT NULL,
    started_at TIMESTAMP DEFAULT timezone('UTC', NOW()) NOT NULL,
    ended_at   TIMESTAMP                                NULL
);

CREATE TABLE sub_themes
(
    id         SERIAL PRIMARY KEY,
    themes_id  INT REFERENCES themes (id),
    name       VARCHAR(255)                             NOT NULL,
    started_at TIMESTAMP DEFAULT timezone('UTC', NOW()) NOT NULL,
    ended_at   TIMESTAMP                                NULL
);

CREATE TABLE themes_regulations
(
    id                   SERIAL PRIMARY KEY,
    themes_id            INT REFERENCES themes (id),
    regulations_cacem_id INT REFERENCES regulations_cacem (id)
);

CREATE TABLE sub_themes_regulations
(
    id                   SERIAL PRIMARY KEY,
    sub_themes_id        INT REFERENCES sub_themes (id),
    regulations_cacem_id INT REFERENCES regulations_cacem (id)
);

-- -- INSERTING DEFAULT THEMES FROM ACTUAL REGULATIONS
-- INSERT INTO themes (name)
-- SELECT DISTINCT trim(theme)
-- FROM (SELECT unnest(string_to_array(thematique, ', ')) AS theme
--       FROM regulations_cacem) t
-- WHERE trim(theme) NOT IN (SELECT name FROM themes);
--
-- -- INSERTING THEMES <-> REGULATIONS FROM ACTUAL REGULATIONS
-- INSERT INTO themes_regulations (themes_id, regulations_cacem_id)
-- select t.id, r.id
-- from regulations_cacem r
--          inner join themes t on t.name = ANY (string_to_array(r.thematique, ', '));