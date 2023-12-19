ALTER TABLE missions
  ADD COLUMN created_at_utc TIMESTAMP,
  ADD COLUMN updated_at_utc TIMESTAMP;

-- Another statement is required so we don't update the existing rows with a default timestamp
ALTER TABLE missions ALTER created_at_utc SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE missions ALTER updated_at_utc SET DEFAULT CURRENT_TIMESTAMP;
