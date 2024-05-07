ALTER TABLE reportings
  ADD COLUMN updated_at_utc TIMESTAMP;

-- Another statement is required so we don't update the existing rows with a default timestamp
ALTER TABLE missions ALTER updated_at_utc SET DEFAULT CURRENT_TIMESTAMP;
