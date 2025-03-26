CREATE TABLE tags
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(255)                             NOT NULL,
    started_at TIMESTAMP DEFAULT timezone('UTC', NOW()) NOT NULL,
    ended_at   TIMESTAMP                                NULL
);

CREATE TABLE sub_tags
(
    id         SERIAL PRIMARY KEY,
    tags_id    INT REFERENCES tags (id),
    name       VARCHAR(255)                             NOT NULL,
    started_at TIMESTAMP DEFAULT timezone('UTC', NOW()) NOT NULL,
    ended_at   TIMESTAMP                                NULL
);
CREATE INDEX idx_fk_tags_id ON sub_tags (tags_id);


CREATE TABLE tags_regulatory_area
(
    tags_id            INT REFERENCES tags (id),
    regulatory_area_id INT REFERENCES regulations_cacem (id),
    primary key (tags_id, regulatory_area_id)
);
CREATE INDEX idx_fk_tags_regulatory_area_tags_id ON tags_regulatory_area (tags_id);
CREATE INDEX idx_fk_tags_regulatory_area_regulations_cacem_id ON tags_regulatory_area (regulatory_area_id);


CREATE TABLE sub_tags_regulatory_area
(
    sub_tags_id        INT REFERENCES sub_tags (id),
    regulatory_area_id INT REFERENCES regulations_cacem (id),
    primary key (sub_tags_id, regulatory_area_id)
);
CREATE INDEX idx_fk_sub_tags_id_regulatory_area_sub_tags_id ON sub_tags_regulatory_area (sub_tags_id);
CREATE INDEX idx_fk_sub_tags_regulatory_area_regulations_cacem_id ON sub_tags_regulatory_area (regulatory_area_id);