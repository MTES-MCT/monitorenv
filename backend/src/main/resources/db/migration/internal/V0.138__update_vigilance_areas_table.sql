-- Update vigilance_areas table
ALTER TABLE public.vigilance_areas ADD COLUMN linked_regulatory_areas INT[];
ALTER TABLE public.vigilance_areas ADD COLUMN linked_amps INT[];