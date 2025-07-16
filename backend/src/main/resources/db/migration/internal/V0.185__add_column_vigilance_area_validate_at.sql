ALTER TABLE vigilance_areas
    ADD COLUMN validated_at TIMESTAMP;

UPDATE vigilance_areas
SET validated_at = COALESCE(created_at, '2024-07-01 00:00:00')
WHERE is_draft IS FALSE;