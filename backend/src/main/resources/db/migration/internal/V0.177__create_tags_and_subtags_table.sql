CREATE TABLE tags
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(255)                             NOT NULL,
    parent_id  INT REFERENCES tags (id),
    started_at TIMESTAMP DEFAULT timezone('UTC', NOW()) NOT NULL,
    ended_at   TIMESTAMP                                NULL
);
CREATE INDEX idx_fk_tags_parent_id ON tags (parent_id);

CREATE TABLE tags_regulatory_area
(
    tags_id            INT REFERENCES tags (id),
    regulatory_area_id INT REFERENCES regulations_cacem (id),
    primary key (tags_id, regulatory_area_id)
);
CREATE INDEX idx_fk_tags_regulatory_area_tags_id ON tags_regulatory_area (tags_id);
CREATE INDEX idx_fk_tags_regulatory_area_regulations_cacem_id ON tags_regulatory_area (regulatory_area_id);