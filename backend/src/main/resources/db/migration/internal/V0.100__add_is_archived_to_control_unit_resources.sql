ALTER TABLE public.control_unit_resources
  ADD COLUMN is_archived BOOLEAN NOT NULL DEFAULT false;
