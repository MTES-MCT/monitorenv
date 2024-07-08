CREATE SCHEMA metabase_uploads;

CREATE ROLE metabase_uploads WITH LOGIN;

GRANT USAGE ON SCHEMA metabase_uploads TO metabase_uploads;
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA "metabase_uploads" TO metabase_uploads;

-- A faire en prod à la mano :
-- GRANT metabase_uploads TO metabase;