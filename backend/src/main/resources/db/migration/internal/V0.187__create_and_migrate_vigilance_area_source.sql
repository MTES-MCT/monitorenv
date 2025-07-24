BEGIN;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Creating table
CREATE TABLE vigilance_areas_source
(
    id                       uuid PRIMARY KEY,
    vigilance_areas_id       integer not null,
    control_unit_contacts_id integer,
    name                     VARCHAR,
    email                    VARCHAR,
    phone                    VARCHAR,
    CONSTRAINT fk_vigilance_areas FOREIGN KEY (vigilance_areas_id) REFERENCES vigilance_areas (id),
    CONSTRAINT fk_control_unit_contacts FOREIGN KEY (control_unit_contacts_id) REFERENCES control_unit_contacts (id)
);

-- Indexing FK
CREATE INDEX idx_vigilance_areas_source_id ON vigilance_areas_source (vigilance_areas_id);
CREATE INDEX idx_control_unit_contacts_id ON vigilance_areas_source (control_unit_contacts_id);

-- Migrating data to new table
INSERT INTO vigilance_areas_source (id, vigilance_areas_id, name)
    (SELECT DISTINCT uuid_generate_v4(), v.id, v.source
     FROM vigilance_areas v);

-- DELETING OLD COLUMNS
-- ALTER TABLE vigilance_areas
--     DROP COLUMN source;

COMMIT;
