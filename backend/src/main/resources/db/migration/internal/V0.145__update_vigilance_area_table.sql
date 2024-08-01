-- ADD COLUMN computed_end_date TIMESTAMP;
ALTER TABLE public.vigilance_areas ADD COLUMN computed_end_date TIMESTAMP;

CREATE INDEX ON public.vigilance_areas (id);
