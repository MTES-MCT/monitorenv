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
CREATE INDEX idx_fk_themes_id ON sub_themes (themes_id);


CREATE TABLE themes_regulatory_area
(
    themes_id          INT REFERENCES themes (id),
    regulatory_area_id INT REFERENCES regulations_cacem (id),
    primary key (themes_id, regulatory_area_id)
);
CREATE INDEX idx_fk_themes_regulatory_area_themes_id ON themes_regulatory_area (themes_id);
CREATE INDEX idx_fk_themes_regulatory_area_regulations_cacem_id ON themes_regulatory_area (regulatory_area_id);


CREATE TABLE sub_themes_regulatory_area
(
    sub_themes_id      INT REFERENCES sub_themes (id),
    regulatory_area_id INT REFERENCES regulations_cacem (id),
    primary key (sub_themes_id, regulatory_area_id)
);
CREATE INDEX idx_fk_sub_themes_regulatory_area_sub_themes_id ON sub_themes_regulatory_area (sub_themes_id);
CREATE INDEX idx_fk_sub_themes_regulatory_area_regulations_cacem_id ON sub_themes_regulatory_area (regulatory_area_id);