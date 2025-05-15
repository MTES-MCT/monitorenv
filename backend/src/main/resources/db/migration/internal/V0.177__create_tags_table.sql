CREATE TABLE tags
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(255)                             NOT NULL,
    parent_id  INT REFERENCES tags (id),
    started_at TIMESTAMP DEFAULT timezone('UTC', NOW()) NOT NULL,
    ended_at   TIMESTAMP                                NULL
);
CREATE INDEX idx_fk_tags_parent_id ON tags (parent_id);

CREATE TABLE tags_regulatory_areas
(
    tags_id             INT REFERENCES tags (id),
    regulatory_areas_id INT REFERENCES regulations_cacem (id),
    primary key (tags_id, regulatory_areas_id)
);

CREATE TABLE tags_vigilance_areas
(
    tags_id            INT REFERENCES tags (id),
    vigilance_areas_id INT REFERENCES vigilance_areas (id),
    primary key (tags_id, vigilance_areas_id)
);

CREATE TABLE tags_env_actions
(
    tags_id        INT REFERENCES tags (id),
    env_actions_id UUID REFERENCES env_actions (id),
    primary key (tags_id, env_actions_id)
);

CREATE TABLE tags_reportings
(
    tags_id       INT REFERENCES tags (id),
    reportings_id INT REFERENCES reportings (id),
    primary key (tags_id, reportings_id)
);
