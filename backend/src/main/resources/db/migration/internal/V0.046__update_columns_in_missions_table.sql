ALTER TABLE missions RENAME COLUMN author to open_by;
--ALTER TABLE missions RENAME COLUMN theme to mission_nature;
--ALTER TABLE missions ALTER COLUMN mission_nature type text[] using ('{'||mission_nature||'}')::text[];
ALTER TABLE missions DROP COLUMN theme;
ALTER TABLE missions ADD COLUMN mission_nature text[];

-- Add missions table
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