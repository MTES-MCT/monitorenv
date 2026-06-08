ALTER TABLE mission_tags
    ADD PRIMARY KEY (id);

ALTER TABLE missions
    ADD COLUMN is_noteworthy BOOLEAN DEFAULT FALSE;

CREATE TABLE mission_tags_missions
(
    mission_tags_id INT REFERENCES mission_tags (id),
    missions_id     INT REFERENCES missions (id),
    primary key (mission_tags_id, missions_id)
)