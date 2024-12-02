ALTER TABLE public.vigilance_areas
    ADD COLUMN created_at      TIMESTAMP,
    ADD COLUMN updated_at      TIMESTAMP,
    ADD COLUMN is_at_all_times BOOLEAN DEFAULT FALSE;