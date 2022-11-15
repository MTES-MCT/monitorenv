ALTER TABLE missions ADD COLUMN deleted boolean NOT NULL default false;
CREATE INDEX idx_missions_deleted on missions (deleted);
