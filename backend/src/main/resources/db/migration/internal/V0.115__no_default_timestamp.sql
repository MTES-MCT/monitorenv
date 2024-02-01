-- let hibernate manage the timestamps
ALTER TABLE missions ALTER created_at_utc SET DEFAULT null;
ALTER TABLE missions ALTER updated_at_utc SET DEFAULT null;

-- ensure at least a timestamp is set so hibernates knows how to handle it
UPDATE missions set created_at_utc = start_datetime_utc where created_at_utc is null;
UPDATE missions set updated_at_utc = start_datetime_utc where updated_at_utc is null;
