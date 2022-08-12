-- update columns definitions in missions table
ALTER TABLE missions RENAME COLUMN author to open_by;
ALTER TABLE missions DROP COLUMN theme;
ALTER TABLE missions DROP COLUMN actions;
ALTER TABLE missions DROP COLUMN unit;
ALTER TABLE missions DROP COLUMN resources;
ALTER TABLE missions DROP COLUMN administration;
ALTER TABLE missions ADD COLUMN mission_nature text[];
ALTER TABLE missions ADD COLUMN resource_units jsonb;

-- Add env_actions table
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.env_actions (
    id uuid PRIMARY KEY,
    mission_id integer NOT NULL,
    action_type text,
    value jsonb NOT NULL,
    FOREIGN KEY (mission_id) REFERENCES missions(id)
);

CREATE INDEX ON public.env_actions (id);
CREATE INDEX ON public.env_actions (mission_id);