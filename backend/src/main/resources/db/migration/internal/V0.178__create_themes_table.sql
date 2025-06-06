CREATE TABLE themes
(
    id                                    SERIAL PRIMARY KEY,
    name                                  VARCHAR(255)                             NOT NULL,
    parent_id                             INT REFERENCES themes (id),
    started_at                            TIMESTAMP DEFAULT timezone('UTC', NOW()) NOT NULL,
    ended_at                              TIMESTAMP                                NULL,
    control_plan_themes_id                INT,
    control_plan_sub_themes_id            INT,
    control_plan_tags_id                  INT,
    reportings_control_plan_sub_themes_id INT
);
CREATE INDEX idx_fk_themes_parent_id ON themes (parent_id);

CREATE TABLE themes_regulatory_areas
(
    themes_id           INT REFERENCES themes (id),
    regulatory_areas_id INT REFERENCES regulations_cacem (id),
    primary key (themes_id, regulatory_areas_id)
);

CREATE TABLE themes_env_actions
(
    themes_id      INT REFERENCES themes (id),
    env_actions_id UUID REFERENCES env_actions (id),
    primary key (themes_id, env_actions_id)
);

CREATE TABLE themes_reportings
(
    themes_id     INT REFERENCES themes (id),
    reportings_id INT REFERENCES reportings (id),
    primary key (themes_id, reportings_id)
);

CREATE TABLE themes_vigilance_areas
(
    themes_id          INT REFERENCES themes (id),
    vigilance_areas_id INT REFERENCES vigilance_areas (id),
    primary key (themes_id, vigilance_areas_id)
);

