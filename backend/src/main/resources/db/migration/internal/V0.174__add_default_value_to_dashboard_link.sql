ALTER TABLE dashboard
    ALTER COLUMN links SET DEFAULT '[]'::JSONB;

UPDATE dashboard
SET links = '[]'::JSONB
WHERE links IS NULL;