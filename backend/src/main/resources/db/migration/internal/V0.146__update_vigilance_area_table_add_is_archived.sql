-- ADD COLUMN computed_end_date TIMESTAMP;
ALTER TABLE public.vigilance_areas ADD COLUMN is_archived BOOLEAN DEFAULT FALSE;
